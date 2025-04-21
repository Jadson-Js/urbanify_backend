# 📌 URBANIFY

Esta API foi desenvolvida para um aplicativo que permite aos usuários reportarem irregularidades nas vias públicas, enviando fotografias e informações de localização. As autoridades estaduais utilizam esses dados para planejar e executar obras de reparo de forma eficiente. O sistema abrange autenticação, gerenciamento de obras, notificações e suporte a coordenadas geográficas, empregando tecnologias desenvolvidas pelo MIT.

---

## 🚀 Tecnologias Utilizadas

- **aws-dynamodb**
- **aws-s3**
- **aws-ses**
- **aws-sns**
- **cors**
- **dotenv-safe**
- **express**
- **express-async-errors**
- **express-validator**
- **jsonwebtoken**
- **multer": "^1.**
- **ngeohash**
- **nodemon**
- **sharp**

---

## 🔒 Autenticação

Esta API utiliza **JWT (JSON Web Token)** para autenticação. Inclua o token no header.

```
Authorization: Bearer SEU_TOKEN
```

---

## 📡 Endpoints

### 🔹 SIGNUP

**POST** `/user/signup`

**_Request_**

- Header

  - `Content-Type: application/json`

- Body
  - `email: (String)`
  - `password: (String)`

**_Response_**

```
{
	"message": "User created successfully",
	"user": {
		"id": "123",
		"email": "email@gmail.com"
	}
}
```

---

### 🔹 LOGIN

**POST** `/user/login`

**_Request_**

- Header

  - `Content-Type: application/json`

- Body
  - `email: (String)`
  - `password: (String)`

**_Response_**

```
{
	"message": "Login successful",
	"accessToken": "123456789",
	"refreshToken": "123456789"
}
```

---

### 🔹 AUTH GOOGLE

**POST** `/user/auth/google`

**_Request_**

- Header

  - `Content-Type: application/json`

- Body
  - `authToken: (String)`

**_Response_**

```
{
	"message": "Login successful",
	"accessToken": "123456789",
	"refreshToken": "123456789"
}
```

---

### 🔹 BUSCAR USERS

**GET** `/user`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
	"message": "Users retrieved successfully",
	"reports": [
		{
			"created_at": "2025-03-31T12:36:09.809Z",
			"report_counter": 3,
			"service_counter": 1
		}
	]
}
```

---

### 🔹 BUSCAR REPORTS

**GET** `/report`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
	"message": "Reports retrieved successfully",
	"reports": [
		{
			"district": "São Paulo",
			"created_at": "2025-03-09T16:48:00.230Z",
			"status": 1,
			"geohash": "12345678",
			"subregion": "Campinas",
			"childrens": [
				{
					"severity": 1,
					"created_at": "2025-03-09T16:48:00.230Z"
				}
			],
			"address": "Campinas_São Paulo",
			"id": "123",
			"coordinates": {
				"latitude": "12.3456789",
				"longitude": "12.3456789"
			},
			"street": "Augusta"
		}
	]
}
```

---

### 🔹 BUSCAR REPORTS AVALIADOS

**GET** `/report/evaluated`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
	"message": "Reports retrieved successfully",
	"reports": [
		{
			"district": "São Paulo",
			"created_at": "2025-03-09T16:48:00.230Z",
			"status": 1,
			"geohash": "12345678",
			"subregion": "Campinas",
			"childrens": [
				{
					"severity": 1,
					"created_at": "2025-03-09T16:48:00.230Z"
				}
			],
			"address": "Campinas_São Paulo",
			"id": "123",
			"coordinates": {
				"latitude": "12.3456789",
				"longitude": "12.3456789"
			},
			"street": "Augusta"
		}
	]
}
```

---

### 🔹 BUSCAR REPORT

**GET** `/report/address/:reportAddress/geohash/:reportGeohash`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
  "message": "Report retrieved successfully",
  "data": {
    "report": {
      "district": "Cambuí",
      "created_at": "2025-03-10T18:02:53.060Z",
      "status": 1,
      "geohash": "6gkz123",
      "subregion": "Região Central",
      "childrens": [
        {
          "severity": 2,
          "coordinates": {
            "latitude": "-22.907104",
            "longitude": "-47.061604"
          },
          "created_at": "2025-03-10T18:08:59.115Z",
          "user_email": "usuario_campinas@gmail.com",
          "s3_photo_key": "2025-03-10T18:08:59.115Z-avaria.jpg"
        }
      ],
      "address": "Camipinas_São Paulo",
      "id": "Abc123Xyz",
      "coordinates": {
        "latitude": "-22.906847",
        "longitude": "-47.061798"
      },
      "street": "Rua Barreto Leme"
    },
    "urls": [
      "https://urbanify.com/imagem.jpg",
      "https://urbanify.com/imagem.jpg"
    ]
  }
}

```

---

### 🔹 BUSCAR MEUS REPORTS

**GET** `/report/my`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
  "message": "Report retrieved successfully",
  "reports": [
		{
			"severity": 1,
			"coordinates": {
				"latitude": "-42.4291",
				"longitude": "-25.23923"
			},
			"created_at": "2025-03-09T16:48:00.230Z",
			"user_email": "usuario_qualquer@gmail.com",
			"s3_photo_key": "2025-03-09T16:48:00.230Z-baki.jpg"
		}
	]
}

```

---

### 🔹 BUSCAR REPORT STATUS

**GET** `/report/address/:reportAddress/geohash/:reportGeohash`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
  "message": "Report retrieved successfully",
  "status": 1
}

```

---

### 🔹 CREATE REPORT

**POST** `/report`

**_Request_**

- Header

  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: multipart/form-data`

- Body
  - file
    - `(Arquivo)`
  - Data
    - `{ "subregion": (String), "district": (String), "street": (String), "severity": (Number), "coordinates": { "latitude": (String), "longitude": (String) }}`

**_Response_**

```
{
    "message": "Report created successfully",
    "report": {
        "id": "123",
        "address": "Campinas_São Paulo",
        "geohash": "12345678"
    }
}
```

---

### 🔹 EDITAR STATUS REPORT PARA AVALIADO

**PATCH** `/report/address/:reportAddress/geohash/:reportGeohash`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
	"message": "Report status updated successfully",
	"report": {
		"address": "Campinas_São Paulo",
		"geohash": "1234567",
		"status": 1
	}
}
```

---

### 🔹 EDITAR STATUS REPORT PARA CONCLUIDO

**PATCH** `/report/repaired`

**_Request_**

- Header

  - `Authorization: Bearer SEU_TOKEN`
  - `Content-Type: multipart/form-data`

- Body
  - file
    - `(Arquivo)`
  - Data
    - `{ "subregion": (String), "district": (String), "street": (String), "severity": (Number), "coordinates": { "latitude": (String), "longitude": (String) }}`

**_Response_**

```
{
	"message": "Report status updated successfully",
	"report": {
		"address": "Campinas_São Paulo",
		"geohash": "1234567",
		"status": 2
	}
}
```

---

### 🔹 DELETAR REPORT

**DELETE** `/report/address/:reportAddress/geohash/:reportGeohash`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

---

### 🔹 BUSCAR REPORTS CONCLUIDOS

**GET** `/resolved`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
	"message": "Report retrieved successfully",
	"report": {
	  "district": "Rua Augusta",
	  "created_at": "2025-03-31T13:47:59.470Z",
	  "geohash": "5f8281e",
	  "status": 2,
	  "subregion": "São Paulo",
	  "childrens": [
	  	{
	  		"severity": 1,
	  		"created_at": "2025-03-31T13:47:59.470Z"
	  	}
	  ],
	  "address": "São Paulo_Rua Augusta",
	  "id": "tRQN1Z97pm40bKq",
	  "expiration_timestamp": 1869659280,
	  "coordinates": {
	  	"latitude": "9.332163770071811",
	  	"longitude": "-21.283837136673467"
	  },
	  "street": "Rua Agostinho"
  }
}
```

---

### 🔹 BUSCAR REPORT CONCLUIDO

**GET** `/resolved/id/:id/created_at/:created_at`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
	"message": "Busca feita com sucesso!",
	"data": {
		"report": {
			"district": "Bairro Fictício",
			"created_at": "2000-01-01T00:00:00.000Z",
			"falseId": "0000-00-00T00:00:00.000Z",
			"geohash": "abcdefg",
			"status": 0,
			"subregion": "Região Inventada",
			"childrens": [
				{
					"severity": 3,
					"coordinates": {
						"latitude": "-10.000000",
						"longitude": "-50.000000"
					},
					"created_at": "2000-01-01T00:00:00.000Z",
					"user_email": "exemplo@falso.com",
					"s3_photo_key": "0000-00-00T00:00:00.000Z-FOTO.jpeg"
				}
			],
			"address": "Rua Imaginária, Bairro Fictício",
			"id": "XXXXXXXXXXXXXXX",
			"expiration_timestamp": 9999999999,
			"coordinates": {
				"latitude": "-10.000000",
				"longitude": "-50.000000"
			},
			"street": "Rua Inventada"
		},
		"urls": [
			"https://exemplo-bucket-falso.s3.region.amazonaws.com/XXXXXXXXXXXXXXX/0000-00-00T00%3A00%3A00.000Z-FOTO.jpeg"
		]
	}
}
```

---

### 🔹 BUSCAR REGISTRO

**GET** `/resolved/registration/id/:id/created_at/:created_at`

**_Request_**

- Header
  - `Authorization: Bearer SEU_TOKEN`

**_Response_**

```
{
	"message": "Busca feita com sucesso!",
	"urls": [
		"https://exemplo-bucket-falso.s3.region.amazonaws.com/XXXXXXXXXXXXXXX/0000-00-00T00%3A00%3A00.000Z-FOTO.jpeg"
	]
}
```

---

## 📞 Contato

- 📧 Email: jadson20051965@gmail.com
- 💼 LinkedIn: [Jadson Abreu](https://www.linkedin.com/in/jadson-abreu/)
