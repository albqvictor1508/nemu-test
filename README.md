# Teste técnico da Nemu

Sistema para organização de uma planilha com jornadas de compra.

## Requisitos

- [Node.js 18+](https://nodejs.org)
- [pnpm](https://pnpm.io/installation)
- [Docker](https://www.docker.com/get-started)

## O que faz

- Mostra touchpoints de usuários em sequência visual
- Destaca primeiro touchpoint (★) e último touchpoint (🎯)
- Trunca jornadas longas com "..." 
- Filtro e paginação na tabela

## Stack

### Back-end
- Fastify + Typescript
- xlsx: Biblioteca para leitura de arquivos Excel
- Drizzle ORM: Mapeamento Objeto-Relacional para queries no banco de dados

### Front-end
- React + TypeScript
- TanStack Table
- Tailwind CSS
- shadcn/ui components

## Como rodar

### API
        ```bash
        docker compose up -d  # Sobe container docker com o banco de dados
        pnpm i               # Instala dependências
        pnpm drizzle         # Roda migrations
        pnpm dev             # Inicia servidor
        ```

### Frontend
        ```bash
        pnpm i    # Instala dependências
        pnpm dev  # Inicia front
        ```

## Funcionalidades

✅ Visualização em sequência com setas  
✅ Cores diferentes por touchpoint  
✅ Destaque para primeiro/último  
✅ Truncamento automático  
✅ Busca global  
✅ Paginação
