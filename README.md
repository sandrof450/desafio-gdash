# Desafio GDash

Projeto Full Stack desenvolvido com foco em arquitetura distribuída, integração entre serviços e processamento assíncrono.

A solução foi construída utilizando diferentes tecnologias para simular cenários reais encontrados em aplicações modernas.

## Arquitetura

* Frontend responsável pela interface do usuário;
* Backend desenvolvido em NestJS;
* Producer em Python para envio de mensagens;
* Worker em Go para processamento assíncrono;
* Infraestrutura containerizada para execução dos serviços.

## Tecnologias

### Frontend

* React
* TypeScript

### Backend

* NestJS
* Prisma ORM
* PostgreSQL
* JWT

### Processamento

* Python
* Go

### Infraestrutura

* Docker
* Docker Compose

## Estrutura do Projeto

desafio-gdash/
├── backend/
├── frontend/
├── go-worker/
├── python-producer/
└── infra/

## Demonstração

Frontend disponível em produção:
https://desafio-gdash-sooty.vercel.app

Os deployments do backend utilizados durante o desenvolvimento foram descontinuados após o término do período gratuito da infraestrutura utilizada. Todo o código-fonte e instruções para execução local permanecem disponíveis neste repositório.

## Objetivo

Demonstrar conhecimentos em desenvolvimento Full Stack, integração entre serviços, autenticação, arquitetura distribuída e boas práticas de organização de projetos.
