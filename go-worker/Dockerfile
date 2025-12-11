# Etapa 1 — build do binário
# MUDANÇA AQUI: Atualizado de golang:1.22 para golang:1.25 para atender ao requisito do go.mod (go >= 1.25.4)
FROM golang:1.25 AS builder

WORKDIR /app

# Copia e baixa as dependências
COPY go.mod go.sum ./
RUN go mod download

# Copia o código fonte (main.go)
COPY . .

# Build do binário para linux/amd64 (binário estático)
# CGO_ENABLED=0 garante que o binário não tem dependências de bibliotecas C
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o worker main.go

# Etapa 2 — imagem final super leve
# Usamos uma imagem base leve como 'scratch' (para binários estáticos) ou 'alpine' (se precisar de shell)
# Neste caso, usamos 'alpine' por ser bem leve.
FROM alpine:3.19

WORKDIR /app

# Instala certificados de CA para permitir requisições HTTPS
RUN apk update && apk add --no-cache ca-certificates

# Copia binário (worker) da etapa de build
COPY --from=builder /app/worker .

# Permite executar o binário
RUN chmod +x worker

# Comando de execução:
# O Go Worker lerá as variáveis de ambiente injetadas pelo Docker Compose/K8S
CMD ["./worker"]