# 1. Usa a imagem base mais estável
FROM python:3.11

# 2. Instala pacotes de sistema necessários
RUN apt-get update && apt-get install -y \
    build-essential \
    libssl-dev \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# 3. Define o diretório de trabalho
WORKDIR /app

# 4. Copia o arquivo de requisitos
COPY requirements.txt .

# 5. Instala dependências
RUN python -m pip install --upgrade --no-cache-dir -r requirements.txt

# 6. Copia o script
COPY producer.py .

# 7. Executa o produtor em modo unbuffered
CMD ["python", "-u", "producer.py"]
