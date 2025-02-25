# 📌 URBANIFY

Esta API foi desenvolvida para um aplicativo que permite aos usuários reportarem irregularidades nas vias públicas, enviando fotografias e informações de localização. As autoridades estaduais utilizam esses dados para planejar e executar obras de reparo de forma eficiente. O sistema abrange autenticação, gerenciamento de obras, notificações e suporte a coordenadas geográficas, empregando tecnologias desenvolvidas pelo MIT.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **DynamoDB**
- **AWS EC2**
- **AWS S3**
- **Geohash**
- **Sharp**
- **Multer**
- **JWT**
- **Dotenv**

---

## 📂 Estrutura do Projeto

```
/src
   ├── api
      ├── controllers
      ├── middlewares
      ├── routes
   ├── config
   ├── models
   ├── services
   ├── utils
```

---

## 🔧 Instalação e Configuração

### 📌 Pré-requisitos

- **Node.js** instalado
- **AWS CLI** configurado (para acesso ao DynamoDB e S3)

### 📥 Passos para Rodar Localmente

1. Clone o repositório:
   ```sh
   git clone https://github.com/Jadson-Js/urbanify_backend.git
   ```
2. Entre na pasta do projeto:
   ```sh
   cd urbanify_backend
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Configure as variáveis de ambiente (`.env`):

   ```env
   JWT_SECRET="XXX-XXX-XXX"
   CRYPTO_UPDATE="XXX-XXX-XXX"
   AWS_REGION="XXX-XXX-XXX"
   AWS_ACCESSKEYID="XXX-XXX-XXX"
   AWS_SECRETACCESSKEY="XXX-XXX-XXX"
   DYNAMODB_ENDPOINT="XXX-XXX-XXX"
   S3_BUCKET="XXX-XXX-XXX"
   ```

````
5. Inicie o servidor:
```sh
npm start
````

---

## 📡 Endpoints

### 🔹 Criar Usuário

**POST** `/user/signup`

```json
{
  "email": "email@gmail.com",
  "password": "senha123"
}
```

### 🔹 Login

**POST** `/user/login`

```json
{
  "email": "email@gmail.com",
  "password": "senha123"
}
```

**Resposta:**

```json
{
  "message": "Login realizado com sucesso.",
  "token": "SEU_TOKEN_AQUI"
}
```

### 🔹 Criar Report

**POST** `/report`

- **Headers:**
  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: multipart/form-data`
- **Form-Data:**
  - `file` (arquivo)
  - `subregion` (string)
  - `district` (string)
  - `street` (string)
  - `severity` (string)
  - `coordinates` (objeto):
    - `latitude` (string)
    - `longitude` (string)

### 🔹 Deletar Report

**DELETE** `/report`

- **Headers:**
  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: application/json`
- **Body:**
  - `address` (string)
  - `geohash` (string)

### 🔹 Listar Reports

**GET** `/report`

- **Headers:**
  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: application/json`

### 🔹 Listar Reports do Usuário Autenticado

**GET** `/report/my`

- **Headers:**
  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: application/json`

**GET** `/report/status/address/:address/geohash/:geohash`

- **Headers:**
  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: application/json`

### 🔹 Verificar Status do Report

**GET** `/report/status`

- **Headers:**
  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: application/json`
- **Body:**
  - `address` (string)
  - `geohash` (string)

### 🔹 Obter Logs do Sistema

**GET** `/log`

- **Headers:**
  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: application/json`

---

**POST** `/log`

- **Headers:**
  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: application/json`
- **Body:**
  - `report_count` (integer)
  - `status` (string)
  - `district` (string)
  - `street` (string)

## 🔒 Autenticação

Esta API utiliza **JWT (JSON Web Token)** para autenticação. Inclua o token no header `Authorization`:

```
Authorization: Bearer SEU_TOKEN
```

---

## 📸 Upload de Imagens

As imagens enviadas pelos usuários são armazenadas no **AWS S3** e processadas pelo **Sharp** para otimização de tamanho.

---

## 📌 Deploy e Produção

A API está hospedada na **AWS EC2** e utiliza **DynamoDB** para armazenamento de dados.

🔗 **Base URL:** `http://18.235.148.108:3000/`

---

## 📞 Contato

- 📧 Email: jadson20051965@gmail.com
- 💼 LinkedIn: [Jadson Abreu](https://www.linkedin.com/in/jadson-abreu/)
