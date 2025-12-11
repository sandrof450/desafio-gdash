import json
import pika
import sys
import time
import requests 
import os # <-- IMPORTAÇÃO CORRIGIDA
from datetime import datetime

# ---------------------------------------------------
## 1. Configurações de Conexão e Ambiente
# ---------------------------------------------------

# Lê as variáveis de ambiente (MELHOR PRÁTICA)
RABBITMQ_URL = os.environ.get("RABBITMQ_URL", "amqp://guest:guest@rabbitmq:5672/")
QUEUE_NAME = os.environ.get("QUEUE_NAME", "weather_queue")

# Variáveis para a API de Clima
OPEN_WEATHER_API_KEY = os.environ.get("OPEN_WEATHER_API_KEY", "PLACEHOLDER_OPENWEATHER_KEY") 
LATITUDE = os.environ.get("LATITUDE", "-27.5945")
LONGITUDE = os.environ.get("LONGITUDE", "-48.5477")
PRODUCER_SOURCE = "go-producer" 

# AJUSTE CRÍTICO: Tratamento de erro para garantir que INTERVAL_SECONDS seja um inteiro
interval_str = os.environ.get("INTERVAL_SECONDS", "200")
try:
    INTERVAL_SECONDS = int(interval_str)
except ValueError:
    print(f"❌ ERRO: INTERVAL_SECONDS '{interval_str}' é inválido. Usando 200 segundos.")
    INTERVAL_SECONDS = 200
    
connection = None
channel = None

def connect_rabbitmq():
    try:
        print("--- INICIANDO CONEXÃO INTERNA COM RABBITMQ ---")
        
        params = pika.URLParameters(RABBITMQ_URL) 
        # Tenta abrir a conexão
        connection = pika.BlockingConnection(params)
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        print("✅ Conexão com RabbitMQ estabelecida com sucesso!")
        
        return connection, channel

    except Exception as e:
        # Se a conexão falhar, este erro será logado antes do sys.exit(1)
        print(f"❌ FATAL: Falha ao conectar ao RabbitMQ: {e}") 
        return None, None 

connection, channel = connect_rabbitmq()


# ---------------------------------------------------
## 2. Função de Coleta e Publicação 🌤️
# ---------------------------------------------------

def get_weather_data_and_publish():
    global channel
    
    API_URL = f"https://api.openweathermap.org/data/2.5/weather?lat={LATITUDE}&lon={LONGITUDE}&appid={OPEN_WEATHER_API_KEY}&units=metric&lang=pt_br"


    if not channel:
        print("❌ Publicação ignorada: Conexão RabbitMQ não está ativa.")
        return

    try:
        # 1. Coleta o dado da API externa
        response = requests.get(API_URL)
        response.raise_for_status()
        weather_data = response.json()
        
        # 2. Normaliza para o formato FINAL que o NestJS aceita
        payload = {
            "temperature": weather_data['main']['temp'],
            "humidity": weather_data['main']['humidity'],
            "windSpeed": weather_data['wind']['speed'],
            "description": weather_data['weather'][0]['description'],
            # CRÍTICO: Adiciona createdAt no formato ISO (string)
            "createdAt": datetime.utcnow().isoformat() + "Z", 
            "source": PRODUCER_SOURCE,
        }
        
        # 3. Publica na fila
        channel.basic_publish(
            exchange="",
            routing_key=QUEUE_NAME,
            body=json.dumps(payload).encode("utf-8"),
            properties=pika.BasicProperties(
                delivery_mode=2,
                content_type="application/json",
            )
        )
        print(f"✅ Dados de clima publicados: {payload['temperature']}°C")
        
    except requests.exceptions.RequestException as e:
        print(f"❌ Erro ao buscar dados do OpenWeather: {e}")
    except Exception as e:
        print(f"❌ Erro geral ao publicar na fila: {e}")


# ---------------------------------------------------
## 3. Inicialização e Agendamento ⏰
# ---------------------------------------------------

if __name__ == "__main__":
    if channel:
        print(f"--- PRODUCER DE CLIMA INICIALIZADO. Coletando a cada {INTERVAL_SECONDS} segundos. ---")
        
        while True:
            get_weather_data_and_publish()
            print(f"Aguardando {INTERVAL_SECONDS} segundos para a próxima coleta...")
            time.sleep(INTERVAL_SECONDS) 
            
    else:
        print("Serviço Produtor não pôde ser iniciado devido à falha na conexão com RabbitMQ.")
        sys.exit(1)