# Backend - NestJS

Este projeto contém a API backend desenvolvida em **NestJS**, responsável pela autenticação dos usuários e gerenciamento dos registros climáticos da aplicação GDash.

A solução foi estruturada visando organização, validação de dados e facilidade de evolução para cenários mais complexos, incluindo futuras expansões para arquiteturas baseadas em microsserviços.

## 🚀 Tecnologias Utilizadas

* Node.js
* NestJS
* Prisma ORM
* MongoDB
* JWT Authentication
* class-validator
* class-transformer

---

## 📦 Estrutura do Projeto

```text
backend/
│── src/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   ├── weather/
│   │   ├── weather.controller.ts
│   │   ├── weather.service.ts
│   │   └── dtos/
│   ├── prisma/
│   │   └── prisma.service.ts
│   └── app.module.ts
│
│── prisma/
│── .env
│── Dockerfile
│── package.json
│── tsconfig.json
│── README.md
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend com:

```env
PORT=3000
DATABASE_URL="mongodb+srv://USUARIO:SENHA@cluster.mongodb.net/gdash"
JWT_SECRET=SUA_CHAVE_AQUI
JWT_EXPIRATION=1d
```

---

## ▶️ Como Rodar o Projeto

### Instalar dependências

```bash
npm install
```

### Executar em modo desenvolvimento

```bash
npm run start:dev
```

### Sincronizar o schema do Prisma com o MongoDB

```bash
npx prisma db push
```

---

## 🔐 Autenticação (JWT)

As rotas protegidas exigem o envio do token JWT no cabeçalho da requisição:

```text
Authorization: Bearer <token>
```

### Rotas de Autenticação

#### POST `/auth/register`

Cria um novo usuário.

#### POST `/auth/login`

Autentica o usuário e retorna o `access_token`.

---

## 🌤 Weather Logs

### POST `/weather/logs`

Cria um novo registro climático.

**Body esperado:**

```json
{
  "temperature": 25,
  "humidity": 70,
  "windSpeed": 10,
  "description": "Dia ensolarado"
}
```

### GET `/weather/logs`

Retorna todos os registros ordenados pela data de criação.

### GET `/weather/logs/:id`

Retorna um registro específico pelo identificador.

---

## 📌 Validação Global

A aplicação utiliza validação global para garantir a integridade dos dados recebidos:

* `whitelist`: remove propriedades não permitidas;
* `forbidNonWhitelisted`: rejeita campos inválidos;
* `transform`: converte automaticamente os tipos recebidos.

Essas configurações são aplicadas globalmente no `main.ts`.

---

## 🎯 Objetivo

Este backend foi desenvolvido para demonstrar conhecimentos em construção de APIs com NestJS, autenticação baseada em JWT, validação de dados, integração com MongoDB através do Prisma e organização de aplicações preparadas para futura evolução arquitetural.
