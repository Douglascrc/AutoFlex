# 🏭 AutoFlex

Sistema de gerenciamento de estoque para indústria, permitindo controle de produtos, matérias-primas e cálculo automático de produtos que podem ser produzidos com o estoque disponível.

![Java](https://img.shields.io/badge/Java-17-orange)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.8-green)
![React](https://img.shields.io/badge/React-19-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)

## 📋 Sobre o Projeto

O AutoFlex é um sistema completo para gestão de estoque industrial que permite:

- **Cadastro de Produtos** - Gerenciar produtos com nome, descrição e preço
- **Cadastro de Matérias-Primas** - Controlar insumos com nome, custo e quantidade em estoque
- **Associação Produto-Matéria** - Definir quais matérias-primas compõem cada produto
- **Cálculo de Producibilidade** - Identificar automaticamente quais produtos podem ser produzidos com o estoque atual

## 🛠️ Tecnologias

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Java 17, Spring Boot 3.3.8, Spring Data JPA, Lombok |
| **Frontend** | React 19, TypeScript, Redux Toolkit, Axios |
| **Banco de Dados** | PostgreSQL 16 |
| **Documentação** | SpringDoc OpenAPI (Swagger) |
| **Testes** | JUnit 5, H2, Cypress |
| **DevOps** | Docker, Docker Compose, Render |

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose
Java 17+, Node.js 18+, Maven

### Opção 1: Docker Compose (Backend + Banco)

```bash
# Clonar o repositório
git clone https://github.com/seu-usuario/autoflex.git
cd autoflex

# Iniciar PostgreSQL + Backend 
docker compose -f infrastructure/compose.yaml up -d

# A aplicação rodará em http://localhost:8080

# Iniciar o frontend
cd frontend-ui
npm install
npm start
```

### Opção 2: Desenvolvimento Local (Sem Docker)

```bash
# 1. Client do Postgres - Banco de dados  

# 2. Terminal - Backend (porta 8080)
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev

# 3. Terminal - Frontend (porta 3000)
cd frontend-ui
npm install
npm start
```

Neste modo:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html

## 📁 Estrutura do Projeto

```
autoflex/
├── src/                          # Backend (Spring Boot)
│   ├── main/
│   │   ├── java/br/com/autoflex/
│   │   │   ├── controller/       # REST Controllers
│   │   │   ├── domain/
│   │   │   │   ├── entity/       # Entidades JPA
│   │   │   │   ├── repository/   # Repositórios
│   │   │   │   └── service/      # Lógica de negócio
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   └── error/            # Tratamento de erros
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.yml
│   │       └── application-prod.yml
│   └── test/                     # Testes unitários
│
├── frontend-ui/                  # Frontend (React)
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   ├── services/             # Chamadas API
│   │   ├── store/                # Redux store
│   │   └── types/                # TypeScript types
│   └── cypress/                  # Testes E2E
│
├── infrastructure/               # Configurações de deploy
│   ├── compose.yaml              # Docker Compose (local)
│   ├── Dockerfile                # Build local
│   └── render.yaml               # Configuração Render
│
├── Dockerfile                    # Build produção (Render)
├── pom.xml                       # Dependências Maven
└── README.md
```

## 📡 API Endpoints

### Produtos
```
GET    /products              # Listar todos
GET    /products/{id}         # Buscar por ID
POST   /products              # Criar
PUT    /products/{id}         # Atualizar
DELETE /products/{id}         # Deletar
GET    /products/producible   # Produtos que podem ser produzidos
POST   /products/{id}/raw-materials  # Associar matéria-prima
```

### Matérias-Primas
```
GET    /raw-materials         # Listar todas
GET    /raw-materials/{id}    # Buscar por ID
POST   /raw-materials         # Criar
PUT    /raw-materials/{id}    # Atualizar
DELETE /raw-materials/{id}    # Deletar
```

## 🧪 Testes

```bash
# Testes unitários (Backend)
./mvnw test

# Testes E2E (Cypress)
cd frontend-ui
npm run cypress:open    # Interface gráfica
npm run cypress:run     # Linha de comando
```

## 🌐 Deploy

A aplicação está disponível em: **[https://autoflex.onrender.com](https://autoflex-pj5x.onrender.com)**

| Recurso | URL |
|---------|-----|
| **Aplicação** | https://autoflex-pj5x.onrender.com |
| **API Swagger** | https://autoflex-pj5x.onrender.com/swagger-ui.html |


## 🏗️ Arquitetura de Deploy

O projeto utiliza **Docker multi-stage build** para criar uma imagem otimizada que contém tanto o frontend quanto o backend.

### Arquitetura de Deploy

```
┌─────────────────────────────────────┐
│         Render Web Service          │
│  ┌───────────────────────────────┐  │
│  │     Docker Container          │  │
│  │  ┌─────────────────────────┐  │  │
│  │  │  Spring Boot App        │  │  │
│  │  │  (porta 8080)           │  │  │
│  │  │                         │  │  │
│  │  │  Serve:                 │  │  │
│  │  │  - API REST (/api/*)    │  │  │
│  │  │  - Frontend (/, /*)     │  │  │
│  │  │    (arquivos estáticos) │  │  │
│  │  └─────────────────────────┘  │  │
│  └───────────────────────────────┘  │
└─────────────────┬───────────────────┘
                  │
                  │ JDBC
                  │
┌─────────────────▼───────────────────┐
│   Render PostgreSQL Database        │
│   (Internal Network)                │
└─────────────────────────────────────┘
```


## 🔧 Configuração

### Backend (application-dev.yml)

```yaml
spring:
  datasource:
    url: ${DATABASE_URL:jdbc:postgresql://localhost:5432/autoflex}
    username: ${DATABASE_USER:postgres}
    password: ${DATABASE_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
```


**Desenvolvido por Douglas Campos** 🚀



