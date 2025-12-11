# === STAGE 1: BUILD (Compilação do React/Vite) ===
FROM node:lts-alpine as build-stage

# Define o diretório de trabalho no container
WORKDIR /app

# Copia o package.json e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante do código fonte
COPY . .

# Constrói o projeto Vite/React
# O comando "npm run build" gera a pasta "dist"
RUN npm run build




# === STAGE 2: PRODUCTION/RUNTIME (Serviço Nginx) ===
# Usa uma imagem Nginx super leve para servir a aplicação
FROM nginx:alpine as production-stage
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos de build (a pasta 'dist') do Stage 1
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expor a porta padrão do Nginx
EXPOSE 80

# Comando padrão do Nginx para rodar e servir a aplicação
CMD ["nginx", "-g", "daemon off;"]