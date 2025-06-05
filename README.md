# Teste técnico da Nemu

Sistema para organização de uma planilha com jornadas de compra.

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

## Funcionalidades

✅ Visualização em sequência com setas.  
✅ Destaque para primeiro/último.
✅ Truncamento automático de touchpoints na tabela no frontend. 
✅ Busca global.  
✅ Paginação.