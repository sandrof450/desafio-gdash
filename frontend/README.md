# Frontend - GDash

Aplicação frontend desenvolvida em React e TypeScript responsável pela interface do usuário do projeto GDash.

A aplicação permite autenticação de usuários e interação com os recursos disponibilizados pela API, consumindo serviços para registro e consulta de informações climáticas.

## Tecnologias Utilizadas

* React
* TypeScript
* Vite
* React Router
* Axios
* JWT Authentication

## Funcionalidades

* Cadastro de usuários;
* Login com autenticação JWT;
* Persistência da sessão autenticada;
* Registro de informações climáticas;
* Consulta dos registros cadastrados;
* Tratamento de rotas protegidas.

## Como executar

Instale as dependências:

```bash
npm install
```

Execute a aplicação:

```bash
npm run dev
```

A aplicação estará disponível em:

```text
http://localhost:5173
```

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3000
```

## Demonstração

Frontend publicado em:

https://desafio-gdash-sooty.vercel.app
