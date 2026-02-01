<p align="center">
  <h1 align="center">🏗️ URBANIFY - Backend API</h1>
  <p align="center">
    <strong>API RESTful robusta para gerenciamento de infraestrutura urbana com arquitetura serverless na AWS</strong>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white" alt="AWS" />
  <img src="https://img.shields.io/badge/DynamoDB-4053D6?style=for-the-badge&logo=amazondynamodb&logoColor=white" alt="DynamoDB" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## 🎬 Demonstração

<p align="center">
  <img src="public/presentation.gif" alt="Demonstração do Urbanify Dashboard" width="100%" />
</p>

---

## 📋 Sobre o Projeto

O **Urbanify Backend** é uma API RESTful desenvolvida para um sistema de gestão de infraestrutura urbana que permite cidadãos reportarem irregularidades em vias públicas (buracos, problemas de iluminação, etc.) através de fotografias geolocalizadas. A plataforma conecta a população com órgãos públicos, otimizando o planejamento e execução de reparos.

### 🎯 Problema Resolvido

- **Para cidadãos**: Canal direto para reportar problemas urbanos com acompanhamento de status
- **Para gestores públicos**: Dashboard centralizado com métricas e visualização geográfica dos reports
- **Para a cidade**: Priorização inteligente de reparos baseada em geolocalização e severidade

---

## 🏛️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ARQUITETURA MVC                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌──────────────┐    ┌───────────┐  │
│  │   ROUTES    │───▶│ MIDDLEWARES  │───▶│ CONTROLLERS  │───▶│ SERVICES  │  │
│  │             │    │              │    │              │    │           │  │
│  │ • /user     │    │ • Auth JWT   │    │ • User       │    │ • User    │  │
│  │ • /report   │    │ • Validation │    │ • Report     │    │ • Report  │  │
│  │ • /resolved │    │ • Rate Limit │    │ • Resolved   │    │ • Resolved│  │
│  │             │    │ • Error      │    │              │    │           │  │
│  └─────────────┘    └──────────────┘    └──────────────┘    └─────┬─────┘  │
│                                                                    │        │
│                                                                    ▼        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CLOUD SERVICES (AWS)                        │   │
│  ├─────────────┬─────────────┬─────────────┬─────────────┬─────────────┤   │
│  │  DynamoDB   │     S3      │     SES     │     SNS     │   Geohash   │   │
│  │  (NoSQL DB) │  (Storage)  │   (Email)   │   (Push)    │  (MIT Lib)  │   │
│  └─────────────┴─────────────┴─────────────┴─────────────┴─────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 📁 Estrutura de Pastas

```
src/
├── api/
│   ├── controllers/     # Lógica de controle das requisições
│   │   ├── UserController.js
│   │   ├── ReportController.js
│   │   └── ResolvedController.js
│   ├── middlewares/     # Interceptadores de requisição
│   │   ├── authMiddleware.js      # Validação JWT
│   │   ├── validationMiddleware.js # Express Validator
│   │   └── errorMiddleware.js     # Tratamento centralizado de erros
│   ├── routes/          # Definição dos endpoints
│   │   ├── userRoutes.js
│   │   ├── reportRoutes.js
│   │   └── resolvedRoutes.js
│   └── app.js           # Configuração Express
├── config/              # Configurações do ambiente
├── models/              # Schemas e modelos de dados
├── services/            # Camada de negócio e integração AWS
│   ├── UserService.js       # CRUD usuários + Auth Google
│   ├── ReportService.js     # Gestão de reports + Geohash
│   └── ResolvedService.js   # Reports concluídos + TTL
└── utils/               # Utilitários e helpers
```

---

## 🛠️ Stack Tecnológica

### Backend Core
| Tecnologia | Propósito |
|------------|-----------|
| **Node.js** | Runtime JavaScript server-side |
| **Express.js** | Framework web minimalista e flexível |
| **ES Modules** | Importação moderna (import/export) |

### Segurança & Autenticação
| Tecnologia | Propósito |
|------------|-----------|
| **JWT** | Tokens stateless para autenticação |
| **Google Auth Library** | OAuth 2.0 com Google |
| **Express Rate Limit** | Proteção contra DDoS/brute force |
| **Express Validator** | Sanitização e validação de inputs |

### AWS Cloud Services
| Serviço | Propósito |
|---------|-----------|
| **DynamoDB** | Banco NoSQL com latência de milissegundos |
| **S3** | Armazenamento de imagens com URLs pré-assinadas |
| **SES** | Notificações por email |
| **SNS** | Push notifications |

### Processamento
| Tecnologia | Propósito |
|------------|-----------|
| **Sharp** | Processamento e otimização de imagens |
| **Multer** | Upload de arquivos multipart |
| **NGeohash** | Algoritmo MIT para coordenadas → hash |

### Qualidade de Código
| Tecnologia | Propósito |
|------------|-----------|
| **Jest** | Framework de testes unitários |
| **Supertest** | Testes de integração HTTP |
| **Nodemon** | Hot reload em desenvolvimento |

---

## 🔐 Sistema de Autenticação

O sistema implementa **autenticação JWT stateless** com suporte a múltiplos métodos:

```javascript
// Fluxo de Autenticação
┌──────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                        │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   Login Tradicional          OAuth Google                     │
│   ┌─────────────┐            ┌─────────────┐                 │
│   │ Email/Pass  │            │ Google Token│                 │
│   └──────┬──────┘            └──────┬──────┘                 │
│          │                          │                         │
│          └──────────┬───────────────┘                         │
│                     ▼                                         │
│            ┌───────────────┐                                  │
│            │ Validate User │                                  │
│            └───────┬───────┘                                  │
│                    ▼                                          │
│            ┌───────────────┐                                  │
│            │  Generate JWT │                                  │
│            │ (Access+Refresh) │                               │
│            └───────┬───────┘                                  │
│                    ▼                                          │
│            ┌───────────────┐                                  │
│            │Return Tokens  │                                  │
│            └───────────────┘                                  │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

**Headers de Requisição:**
```
Authorization: Bearer <access_token>
```

---

## 🌍 Sistema de Geolocalização

Utiliza o algoritmo **Geohash** (desenvolvido pelo MIT) para:

- **Agrupamento espacial**: Reports próximos compartilham prefixos de hash
- **Busca eficiente**: Queries por região sem full table scan
- **Clustering**: Visualização agregada no mapa

```javascript
// Exemplo de precisão Geohash
// 7 caracteres = ~153m x 153m de precisão
coordinates: { lat: -22.906847, lng: -47.061798 }
    ↓
geohash: "6gkz88v"
```

---

## 📡 API Endpoints

### 👤 Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/user/signup` | Cadastro de usuário |
| `POST` | `/user/login` | Login com email/senha |
| `POST` | `/user/auth/google` | Login via Google OAuth |
| `GET` | `/user` | Listar usuários (admin) |

### 📝 Reports (Denúncias)

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `POST` | `/report` | Criar novo report (multipart) |
| `GET` | `/report` | Listar todos os reports |
| `GET` | `/report/my` | Meus reports |
| `GET` | `/report/evaluated` | Reports avaliados |
| `GET` | `/report/address/:addr/geohash/:geo` | Buscar report específico |
| `PATCH` | `/report/address/:addr/geohash/:geo` | Atualizar status para avaliado |
| `PATCH` | `/report/repaired` | Marcar como concluído |
| `DELETE` | `/report/address/:addr/geohash/:geo` | Remover report |

### ✅ Reports Concluídos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/resolved` | Listar concluídos |
| `GET` | `/resolved/id/:id/created_at/:date` | Detalhes do concluído |
| `GET` | `/resolved/registration/...` | Registro fotográfico |

---

## 🔧 Configuração do Projeto

### Pré-requisitos

- Node.js 18+
- Conta AWS com credenciais configuradas
- Variáveis de ambiente configuradas

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/urbanify-backend.git

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Execute em modo desenvolvimento
npm start
```

### Variáveis de Ambiente

```env
# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# DynamoDB
DYNAMODB_TABLE_USERS=users
DYNAMODB_TABLE_REPORTS=reports
DYNAMODB_TABLE_RESOLVED=resolved

# S3
S3_BUCKET_NAME=urbanify-images

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
```

---

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Executar com coverage
npm test -- --coverage
```

---

## 📊 Decisões Técnicas

### Por que DynamoDB?
- **Escalabilidade automática** para picos de uso
- **Single-digit millisecond latency** para reads
- **Pay-per-request** otimiza custos
- **Geohash como partition key** para queries geográficas eficientes

### Por que Geohash?
- Converte coordenadas 2D em string 1D
- Permite range queries por proximidade
- Agrupa reports vizinhos automaticamente
- Desenvolvido pelo MIT, vastamente testado

### Por que JWT Stateless?
- Elimina necessidade de session store
- Escalabilidade horizontal sem state sync
- Tokens auto-contidos com claims
- Refresh tokens para renovação segura

---

## 📞 Contato

<p align="center">
  <a href="mailto:jadson20051965@gmail.com">
    <img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" />
  </a>
  <a href="https://www.linkedin.com/in/jadson-abreu/">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

---

<p align="center">
  <strong>Desenvolvido por Jadson Abreu</strong>
</p>
