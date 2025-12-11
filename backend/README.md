<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>

</p>
  <!--
  -->

GDash API Backend

Description

Este é o backend da API GDash, construído com o framework NestJS e utilizando Prisma como ORM para conexão com MongoDB Atlas. A aplicação é conteinerizada usando Docker para garantir um ambiente de execução consistente.

🚀 Setup do Projeto (Docker)

Para iniciar o projeto, você precisará ter o Docker e o Docker Compose instalados.

Pré-requisito: Certifique-se de ter um arquivo .env configurado na raiz do diretório backend.

Inicialização (Build e Start):
O comando abaixo irá construir a imagem Docker, instalar as dependências, compilar o projeto e iniciar o container em modo detached (segundo plano).

docker compose up --build -d


Visualizar Logs:
Para verificar os logs de inicialização da API (e confirmar que o NestJS iniciou corretamente), use:

docker compose logs -f


Acesso:
A aplicação estará disponível em http://localhost:3000.

⚙️ Variáveis de Ambiente (.env)

O arquivo .env é lido pelo Docker Compose para injetar as variáveis necessárias no contêiner.

Variável

Descrição

Exemplo de Valor

DATABASE_URL

String de conexão completa do MongoDB Atlas. (Obrigatório)

mongodb+srv://user:pass@cluster.mongodb.net/db

PORT

Porta de execução da API.

3000

NODE_ENV

Define o ambiente (configurado para produção no Docker Compose).

production

LOG_LEVEL

Nível de detalhe do log (e.g., info, debug, warn).

info

JWT_ACCESS_SECRET

Chave secreta para tokens de acesso JWT.

4a827787c64...

JWT_REFRESH_SECRET

Chave secreta para tokens de refresh JWT.

39445682871...

WORKER_API_KEY

Chave de segurança para comunicação com serviços Worker.

25efb6b59f1...

Conteúdo do seu .env (Exemplo):

PORT=3000
DATABASE_URL=mongodb+srv://admin:SenhaForte@clusterparatestes.wo2eqqz.mongodb.net/clusterParaTestes?retryWrites=true&w=majority
JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
WORKER_API_KEY=...


🏃 Comandos de Execução

Estes comandos são executados no terminal fora do contêiner Docker.

1. Iniciar em Produção (Conteinerizado)

Este é o comando principal para rodar a aplicação em produção via Docker Compose:

# Constrói a imagem e inicia o container em background (melhor para produção)
docker compose up --build -d


2. Iniciar em Modo de Desenvolvimento (Local)

Para rodar localmente (fora do Docker), use:

# Instala as dependências (se não o fez)
npm install

# Inicia em modo watch (recompila ao salvar arquivos)
npm run start:dev


🌐 Exemplos de Endpoints

Assumindo que a API está rodando na porta 3000.

Método

Endpoint

Descrição

GET

/health

Checa a saúde da API.

GET

/profile/me

Obtém o perfil do usuário autenticado.

PATCH

/profile/update

Atualiza informações do perfil.

PATCH

/profile/change-password

Altera a senha do usuário.

POST

/auth/login

Rota para autenticação.

POST

/auth/register

Rota para criação de nova conta.

Project setup

$ npm install


Compile and run the project

# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod


Run tests

# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov