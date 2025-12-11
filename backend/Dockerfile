# ==================================================
# ESTÁGIO 1: BUILDER
# Objetivo: Instalar dependências, gerar o Prisma Client e compilar o código NestJS.
# ==================================================
FROM node:lts-slim AS builder
WORKDIR /app

# Variável para otimizar o uso de binários nativos do Node.js pelo Prisma
ENV PRISMA_FORCE_NAPI=true

# 1. Instalação de Dependências
# Copia e instala pacotes AQUI
COPY package*.json ./
RUN npm install

# 2. Geração do Prisma Client
COPY prisma ./prisma
RUN npx prisma generate

# 3. Compilação do Código
COPY . .
RUN npm run build


# ==================================================
# ESTÁGIO 2: RUNNER (IMAGEM FINAL DE PRODUÇÃO)
# Objetivo: Copiar apenas o mínimo necessário para rodar a aplicação em produção.
# ==================================================
FROM node:lts-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PRISMA_FORCE_NAPI=true

# --- GARANTIA DE DEPENDÊNCIA (OpenSSL 3.0.x) ---
RUN apt-get update -y && \
    apt-get install -y openssl && \
    rm -rf /var/lib/apt/lists/*

# 1. CORREÇÃO CRÍTICA: Copia package.json e package-lock.json para o runner
# O comando `npm run` precisa desses arquivos.
# Vamos copiá-los diretamente do contexto local, e NÃO do estágio 'builder',
# para garantir que estejam no lugar certo.
COPY package.json ./
COPY package-lock.json ./

# 2. Copia artefatos necessários do estágio 'builder'
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# 3. Configuração e Inicialização
EXPOSE 3000

# Comando padrão (Fallback, mas estamos usando 'command' no docker-compose.yml agora)
CMD ["node", "dist/main.js"]