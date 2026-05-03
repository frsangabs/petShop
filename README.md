# Pet Shop App

Aplicativo de gestão para pet shop desenvolvido com React Native, Expo Router e um backend Node.js simples. O projeto permite controlar pets, donos, agendamentos, histórico de atendimentos, pacotes de banho e indicadores de dashboard.

## Visão geral

O sistema foi pensado para organizar a rotina operacional de um pet shop: cadastrar clientes e pets, criar atendimentos, acompanhar pagamentos, concluir serviços e consultar o histórico. O app funciona com estado local no frontend e também pode sincronizar com o backend rodando em `http://localhost:3333`.

## Funcionalidades

- Cadastro e edição de pets.
- Cadastro e edição de donos.
- Criação de agendamentos.
- Criação de pacotes de banho com múltiplos atendimentos.
- Marcação de pagamento.
- Conclusão de agendamentos e envio para histórico.
- Cancelamento de agendamentos.
- Dashboard com indicadores do período.
- Persistência local no navegador como fallback.
- Backend com armazenamento em JSON local ou PostgreSQL via Prisma.

## Tecnologias

### Frontend

- Expo SDK 54
- React 19
- React Native 0.81
- Expo Router
- React Navigation
- TypeScript e JavaScript

### Backend

- Node.js
- HTTP server nativo do Node
- Prisma ORM
- PostgreSQL opcional
- JSON local como banco fallback

## Estrutura do projeto

```text
.
+-- app/                     # Rotas do Expo Router
+-- src/pet/                 # Telas, componentes, contexto e utilitários do domínio pet shop
+-- backend/                 # API Node.js e camada de persistência
|   +-- src/                 # Servidor, repositório, dashboard e formatadores
|   +-- prisma/              # Schema, migrations e seed do Prisma
|   +-- data/db.json         # Banco JSON local usado quando DATABASE_URL não existe
+-- assets/                  # Imagens do app
+-- components/              # Componentes base do template Expo
+-- hooks/                   # Hooks compartilhados
+-- constants/               # Constantes visuais
```

## Pré-requisitos

- Node.js instalado
- npm instalado
- Expo Go no celular ou emulador Android/iOS configurado
- PostgreSQL apenas se quiser usar banco relacional

## Como rodar

Instale as dependências do app:

```bash
npm install
```

Instale as dependências do backend:

```bash
npm install --prefix backend
```

Inicie o backend:

```bash
npm run backend
```

Em outro terminal, inicie o app:

```bash
npm start
```

Depois disso, escolha no terminal do Expo se deseja abrir no navegador, Android, iOS ou Expo Go.

## Scripts disponíveis

### App

```bash
npm start          # inicia o Expo
npm run android    # abre no Android
npm run ios        # abre no iOS
npm run web        # abre no navegador
npm run lint       # executa lint
npm run backend    # inicia o backend a partir da raiz
```

### Backend

```bash
npm --prefix backend run dev              # inicia a API
npm --prefix backend run start            # inicia a API
npm --prefix backend run prisma:generate  # gera o Prisma Client
npm --prefix backend run prisma:migrate   # executa migrations
npm --prefix backend run prisma:studio    # abre o Prisma Studio
npm --prefix backend run db:seed          # popula o banco PostgreSQL
```

## Backend e banco de dados

Por padrão, se a variável `DATABASE_URL` não estiver configurada, o backend usa o arquivo:

```text
backend/data/db.json
```

Para usar PostgreSQL, configure `DATABASE_URL` no ambiente antes de iniciar o backend. Exemplo:

```bash
DATABASE_URL="postgresql://usuario:senha@localhost:5432/petshop"
```

Depois execute:

```bash
npm --prefix backend run prisma:generate
npm --prefix backend run prisma:migrate
npm --prefix backend run db:seed
```

## Rotas principais da API

```text
GET    /health
GET    /dados
GET    /dashboard
POST   /pets
PATCH  /pets/:id
PATCH  /donos/:id
POST   /agendamentos
PATCH  /agendamentos/:id
DELETE /agendamentos/:id
POST   /agendamentos/:id/concluir
POST   /pacotes
PATCH  /pacotes/:id
PATCH  /historico/:id
```

## Observações de desenvolvimento

- O frontend tenta carregar dados da API em `http://localhost:3333`.
- Se a API estiver indisponível, o app mantém uma experiência local usando dados em memória e `localStorage` no web.
- Em dispositivo físico, `localhost` aponta para o próprio aparelho. Para testar com backend local no celular, ajuste a URL da API em `src/pet/context/PetShopContext.jsx` para o IP da máquina na rede.
- O projeto ainda não possui suíte de testes automatizados configurada.

## Status

Projeto em desenvolvimento, com foco em um MVP funcional para gestão de rotina de pet shop.
