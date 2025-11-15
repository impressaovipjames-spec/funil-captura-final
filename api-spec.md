# API Blueprint - Funil de Captura

Especificação completa de todas as rotas da API.

## Base URL

```
http://localhost:5000
```

## Formato de Resposta Padrão

Todas as respostas seguem o formato:

```json
{
  "success": boolean,
  "message": string,
  "data": object | array | null
}
```

---

## Endpoints

### 1. Health Check

**GET /healthcheck**

Verifica o status do servidor.

**Request:**
- Method: `GET`
- Headers: None
- Body: None

**Response:**
```json
{
  "status": "ok"
}
```

**Status Codes:**
- `200 OK` - Servidor funcionando

---

### 2. Criar Lead

**POST /api/leads**

Cria um novo lead com nome e email.

**Request:**
- Method: `POST`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body:
  ```json
  {
    "nome": "João Silva",
    "email": "joao.silva@email.com"
  }
  ```

**Validações:**
- `nome` (string, obrigatório, não vazio)
- `email` (string, obrigatório, formato válido)
- Regex email: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Sanitização: remove caracteres `<` e `>`

**Response (Success):**
```json
{
  "success": true,
  "message": "Lead cadastrado com sucesso",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "João Silva",
    "email": "joao.silva@email.com"
  }
}
```

**Response (Error - Email Inválido):**
```json
{
  "success": false,
  "message": "Email inválido",
  "data": null
}
```

**Response (Error - Dados Faltando):**
```json
{
  "success": false,
  "message": "Nome e email são obrigatórios",
  "data": null
}
```

**Status Codes:**
- `200 OK` - Lead criado com sucesso
- `400 Bad Request` - Dados inválidos

**Side Effects:**
- Lead salvo em memória
- Lead persistido em `leads.json`
- Backup criado em `leads.bak.json`

---

### 3. Listar Leads

**GET /api/leads**

Retorna todos os leads armazenados em memória.

**Request:**
- Method: `GET`
- Headers: None
- Body: None

**Response:**
```json
{
  "success": true,
  "message": "Leads recuperados com sucesso",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "nome": "João Silva",
      "email": "joao.silva@email.com"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "nome": "Maria Santos",
      "email": "maria.santos@email.com"
    }
  ]
}
```

**Response (Vazio):**
```json
{
  "success": true,
  "message": "Leads recuperados com sucesso",
  "data": []
}
```

**Status Codes:**
- `200 OK` - Sucesso
- `500 Internal Server Error` - Erro ao recuperar dados

---

### 4. Debug: Conteúdo de leads.json

**GET /leads**

Retorna o conteúdo direto do arquivo leads.json (para debug).

**Request:**
- Method: `GET`
- Headers: None
- Body: None

**Response (Com dados):**
```json
{
  "success": true,
  "message": "Conteúdo de leads.json",
  "data": {
    "total": 2,
    "leads": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "nome": "João Silva",
        "email": "joao.silva@email.com"
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "nome": "Maria Santos",
        "email": "maria.santos@email.com"
      }
    ]
  }
}
```

**Response (Arquivo não existe):**
```json
{
  "success": true,
  "message": "Arquivo leads.json não existe",
  "data": {
    "total": 0,
    "leads": []
  }
}
```

**Status Codes:**
- `200 OK` - Sucesso
- `500 Internal Server Error` - Erro ao ler arquivo

---

## Objetos de Dados

### Lead

```typescript
{
  id: string,        // UUID v4
  nome: string,      // Nome do lead (sanitizado)
  email: string      // Email do lead (sanitizado, validado)
}
```

### InsertLead (Request)

```typescript
{
  nome: string,      // Obrigatório, min 1 caractere
  email: string      // Obrigatório, formato válido
}
```

---

## Error Handling

Todos os erros retornam o formato padrão:

```json
{
  "success": false,
  "message": "Descrição do erro",
  "data": null
}
```

**Tipos de Erro:**

| Status | Message | Causa |
|--------|---------|-------|
| 400 | "Requisição inválida" | Body não é JSON válido |
| 400 | "Nome e email são obrigatórios" | Campos faltando |
| 400 | "Dados inválidos" | Tipos incorretos |
| 400 | "Email inválido" | Email não passa na validação regex |
| 500 | "Erro interno do servidor" | Erro não tratado |

---

## Exemplos de Uso

### cURL - Criar Lead

```bash
curl -X POST http://localhost:5000/api/leads \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@email.com"}'
```

### cURL - Listar Leads

```bash
curl http://localhost:5000/api/leads
```

### cURL - Health Check

```bash
curl http://localhost:5000/healthcheck
```

### JavaScript (Fetch)

```javascript
// Criar lead
const response = await fetch('http://localhost:5000/api/leads', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'João Silva',
    email: 'joao@email.com'
  })
});
const result = await response.json();

// Listar leads
const leads = await fetch('http://localhost:5000/api/leads')
  .then(res => res.json());
```

---

## Observações

- Todas as respostas usam UTF-8
- IDs são gerados como UUID v4
- Backup automático é criado a cada novo lead
- Sanitização remove caracteres `<` e `>`
- Validação de email usa regex simples
- Sem autenticação ou rate limiting
