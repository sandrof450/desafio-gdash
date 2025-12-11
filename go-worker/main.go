package main

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/streadway/amqp"
)

// Variáveis de Ambiente esperadas (devem ser setadas no docker-compose.yml):
// RABBITMQ_URL="amqp://guest:guest@rabbitmq:5672/"
// QUEUE_NAME="weather_queue"
// NEST_ENDPOINT="http://nestjs-backend:3000"
// WORKER_API_KEY="SUA_CHAVE_SECRETA_DO_NESTJS"
// WORKER_SERVICE_ID="692dba9bd1881c5dcf431428" // ID Fixo para o header x-user-id

// ---------------------------------------------------
// 🔹 UTILS & HEALTH-CHECK
// ---------------------------------------------------

func healthCheck() bool {
	base := os.Getenv("NEST_ENDPOINT")
	apiKey := "25efb6b59f1700721cac5c663392e730c5a8629c"
	serviceID := os.Getenv("WORKER_SERVICE_ID")

	if base == "" || apiKey == "" || serviceID == "" {
		log.Println("❌ Erro: Variáveis de ambiente críticas não definidas.")
		return false
	}

	// Usamos o endpoint /health.
	url := base + "/health"

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("x-api-key", apiKey)
	req.Header.Add("x-user-id", serviceID) // Header x-user-id no health check
	log.Println("Como ficou header", req.Header)

	client := http.Client{Timeout: 5 * time.Second}
	resp, err := client.Do(req)

	if err != nil {
		log.Println("❌ Health-check falhou ao conectar:", err)
		return false
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 500 {
		log.Println("✅ Health-check Status:", resp.StatusCode)
		return true
	}

	log.Printf("❌ Health-check falhou com Status: %d\n", resp.StatusCode)
	return false
}

// ---------------------------------------------------
// 🔹 ENVIAR DADOS PARA NESTJS (POST)
// ---------------------------------------------------

// sendLogToNest envia a mensagem de clima recebida da fila para o NestJS via POST.
func sendLogToNest(payload []byte) {
	base := os.Getenv("NEST_ENDPOINT")
	apiKey := os.Getenv("WORKER_API_KEY")
	serviceID := os.Getenv("WORKER_SERVICE_ID")

	// Rota para o endpoint de ingestão: /internal/weather
	url := base + "/internal/weather"

	if serviceID == "" {
		log.Println("❌ Erro: WORKER_SERVICE_ID não definido. Abortando envio de log.")
		return
	}

	// Cria um buffer de bytes a partir do payload JSON
	bodyReader := bytes.NewReader(payload)

	req, err := http.NewRequest("POST", url, bodyReader)
	if err != nil {
		log.Printf("❌ Erro ao criar requisição POST: %v", err)
		return
	}

	// Adiciona headers para autenticação e tipo de conteúdo
	req.Header.Add("x-api-key", apiKey)
	req.Header.Add("Content-Type", "application/json")
	// Adiciona o header x-user-id exigido pelo NestJS
	req.Header.Add("x-user-id", serviceID)

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("❌ Erro ao fazer requisição POST para NestJS: %v", err)
		return
	}
	defer resp.Body.Close()

	// Lida com a resposta do NestJS
	if resp.StatusCode == 201 {
		log.Println("✅ Log de clima enviado com sucesso para o NestJS.")
	} else {
		// Loga a resposta para debug
		responseBody, _ := io.ReadAll(resp.Body)
		log.Printf("❌ Falha ao enviar log. Status: %d. Resposta do NestJS: %s\n", resp.StatusCode, responseBody)
	}
}

// ---------------------------------------------------
// 🔹 CONSUMIDOR DE RABBITMQ
// ---------------------------------------------------

// handleMessage é a função de callback que processa cada mensagem recebida.
func handleMessage(delivery amqp.Delivery) {
	log.Printf("📨 Mensagem recebida. Tamanho: %d bytes\n", len(delivery.Body))
	sendLogToNest(delivery.Body)
	// ACK só é enviado após a tentativa (sucesso ou falha) de envio para o NestJS
	delivery.Ack(false)
	log.Println("✅ Mensagem confirmada (ACK).")
}

// consumeQueue conecta-se ao RabbitMQ e inicia o loop de consumo.
func consumeQueue() {
	rabbitUrl := os.Getenv("RABBITMQ_URL")
	queueName := os.Getenv("QUEUE_NAME")

	if rabbitUrl == "" || queueName == "" {
		log.Println("❌ Erro: RABBITMQ_URL ou QUEUE_NAME não definidos.")
		return
	}

	// 1. Conecta ao RabbitMQ (Note: streadway/amqp tenta lidar com heartbeats por padrão,
	// mas a lentidão na goroutine de recebimento pode bloquear o envio de heartbeats)
	conn, err := amqp.Dial(rabbitUrl)
	if err != nil {
		log.Fatalf("❌ Falha ao conectar ao RabbitMQ: %v", err)
	}
	defer conn.Close()

	ch, err := conn.Channel()
	if err != nil {
		log.Fatalf("❌ Falha ao abrir o canal: %v", err)
	}
	defer ch.Close()

	// Declara a fila (garante que ela existe)
	q, err := ch.QueueDeclare(
		queueName, // nome
		true,      // durable
		false,     // delete when unused
		false,     // exclusive
		false,     // no-wait
		nil,       // arguments
	)
	if err != nil {
		log.Fatalf("❌ Falha ao declarar a fila: %v", err)
	}

	// Garante que o Worker só receba 1 mensagem por vez (QoS)
	ch.Qos(1, 0, false)

	// Inicia o consumo da fila
	msgs, err := ch.Consume(
		q.Name, // queue
		"",     // consumer
		false,  // auto-ack (desativado, faremos ack manual)
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		log.Fatalf("❌ Falha ao registrar o consumidor: %v", err)
	}

	// Loop infinito para manter o worker ativo e ouvindo
	forever := make(chan bool)

	log.Printf("✅ Worker Go pronto! Aguardando mensagens na fila '%s'.", q.Name)
	log.Println("URL FINAL PARA REQUISIÇÃO:", rabbitUrl)

	go func() {
		for d := range msgs {
			// 🚀 AJUSTE CRÍTICO: Executa o processamento em uma nova goroutine
			// Isso evita que a chamada de rede síncrona bloqueie o loop de consumo
			// e cause o erro de 'missed heartbeats' no RabbitMQ.
			go handleMessage(d)
		}
	}()

	<-forever // Mantém o programa rodando até receber um sinal para parar
}

// ---------------------------------------------------
// 🔹 MAIN
// ---------------------------------------------------

func main() {
	// Carregar env
	err := godotenv.Load()
	if err != nil {
		log.Println("Aviso: Não foi possível carregar o arquivo .env (assumindo variáveis de ambiente setadas externamente).")
	}

	// 1️⃣ Executar health-check inicial com retentativas
	for i := 0; i < 3; i++ {
		if healthCheck() {
			break
		}
		log.Printf("❌ API interna fora do ar. Tentando novamente em %d segundos...\n", 10*(i+1))
		time.Sleep(time.Duration(10*(i+1)) * time.Second)
		if i == 2 {
			log.Fatal("❌ API interna inacessível após nova tentativa. Encerrando worker.")
			return
		}
	}

	// 2️⃣ Iniciar o Consumidor da Fila
	consumeQueue()
}
