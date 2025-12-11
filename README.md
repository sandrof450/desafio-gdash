# Backend - NestJS

Este projeto contém a API backend desenvolvida em **NestJS**, já preparada para futura expansão para arquitetura de **microserviços**.

## 🚀 Tecnologias Utilizadas

* **Node.js**
* **NestJS**
* **Prisma ORM**
* **PostgreSQL** (ou outro banco, conforme `.env`)
* **JWT Authentication**
* **Class-validator / class-transformer**

---

## 📦 Estrutura do Projeto

```
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
│── .env
│── Dockerfile
│── package.json
│── tsconfig.json
│── README.md
```

---

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend com:

```
PORT=3000
DATABASE_URL="postgresql://USER:SENHA@HOST:PORT/DB?schema=public"
JWT_SECRET=SUA_CHAVE_AQUI
JWT_EXPIRATION=1d
```

---

## ▶️ Como Rodar o Projeto

### Instalar dependências:

```
npm install
```

### Rodar em modo desenvolvimento:

```
npm run start:dev
```

### Rodar migrações do Prisma:

```
npx prisma migrate dev
```

---

## 🔐 Autenticação (JWT)

Rotas protegidas exigem um header:

```
Authorization: Bearer <token>
```

### **Rotas de Autenticação**

#### POST `/auth/register`

Cria um novo usuário.

#### POST `/auth/login`

Retorna `access_token`.

---

## 🌤 Weather Logs

### **POST `/weather/logs`**

Cria um novo registro de clima.

**Body esperado:**

```
{
  "temperature": 25,
  "humidity": 70,
  "windSpeed": 10,
  "description": "Dia ensolarado"
}
```

### **GET `/weather/logs`**

Retorna todos os registros ordenados por data.

### **GET `/weather/logs/:id`**

Busca registro individual.

---

## 📌 Validação Global

A aplicação usa:

```
Whitelist: remove campos extras
forbidNonWhitelisted: bloqueia campos inválidos
transform: converte tipos
```

Configurado no `main.ts`.

---