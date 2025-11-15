# Migração Node.js/Express para Python/Flask

Guia para migrar o funil de captura de Node.js/Express para Python/Flask.

## Estrutura de Diretórios

### Node.js/Express (Atual)
```
server/
  routes.ts
  storage.ts
  index.ts
client/src/
  pages/
scripts/
shared/
  schema.ts
```

### Python/Flask (Proposta)
```
app/
  routes.py
  storage.py
  models.py
  __init__.py
static/
templates/
scripts/
```

## Conversão de Arquivos

### 1. server/index.ts → app/__init__.py

**Node.js:**
```javascript
import express from "express";
const app = express();
app.use(express.json());
```

**Python:**
```python
from flask import Flask
app = Flask(__name__)
```

### 2. server/storage.ts → app/storage.py

**Node.js:**
```typescript
export class MemStorage implements IStorage {
  private leads: Map<string, Lead>;
  
  async createLead(insertLead: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { ...insertLead, id };
    this.leads.set(id, lead);
    this.saveToFile();
    return lead;
  }
}
```

**Python:**
```python
import json
import uuid
from typing import Dict, List, Optional

class MemStorage:
    def __init__(self):
        self.leads: Dict[str, dict] = {}
        self.load_from_file()
    
    def create_lead(self, insert_lead: dict) -> dict:
        lead_id = str(uuid.uuid4())
        lead = {**insert_lead, 'id': lead_id}
        self.leads[lead_id] = lead
        self.save_to_file()
        return lead
```

### 3. server/routes.ts → app/routes.py

**Node.js:**
```typescript
app.post("/api/leads", async (req, res) => {
  try {
    const validatedData = insertLeadSchema.parse(req.body);
    const lead = await storage.createLead(validatedData);
    res.json({ success: true, message: "Lead cadastrado", data: lead });
  } catch (error) {
    res.status(400).json({ success: false, message: "Erro", data: null });
  }
});
```

**Python:**
```python
from flask import request, jsonify

@app.route('/api/leads', methods=['POST'])
def create_lead():
    try:
        data = request.get_json()
        sanitized = sanitize_input(data)
        lead = storage.create_lead(sanitized)
        return jsonify({
            'success': True, 
            'message': 'Lead cadastrado', 
            'data': lead
        }), 201
    except Exception as e:
        return jsonify({
            'success': False, 
            'message': str(e), 
            'data': None
        }), 400
```

### 4. shared/schema.ts → app/models.py

**Node.js (Zod):**
```typescript
export const insertLeadSchema = createInsertSchema(leads).pick({
  nome: true,
  email: true,
});
```

**Python (sem lib externa):**
```python
import re

EMAIL_REGEX = re.compile(r'^[^\s@]+@[^\s@]+\.[^\s@]+$')

def validate_lead(data):
    if not data.get('nome') or not data.get('email'):
        raise ValueError('Nome e email são obrigatórios')
    
    if not isinstance(data['nome'], str) or not isinstance(data['email'], str):
        raise ValueError('Dados inválidos')
    
    if not EMAIL_REGEX.match(data['email']):
        raise ValueError('Email inválido')
    
    return True
```

## Substituição de Bibliotecas

| Node.js/Express | Python/Flask |
|-----------------|--------------|
| `express` | `flask` |
| `zod` | validação manual ou `pydantic` |
| `randomUUID()` | `uuid.uuid4()` |
| `fs.readFileSync()` | `open().read()` / `json.load()` |
| `fs.writeFileSync()` | `open().write()` / `json.dump()` |
| `path.join()` | `os.path.join()` |

## Funções de Sanitização

**Node.js:**
```typescript
function sanitizeInput(str: string): string {
  return str.trim().replace(/[<>]/g, "");
}
```

**Python:**
```python
def sanitize_input(data):
    return {
        'nome': data.get('nome', '').strip().replace('<', '').replace('>', ''),
        'email': data.get('email', '').strip().replace('<', '').replace('>', '')
    }
```

## Middleware de Validação

**Node.js:**
```typescript
function validateRequest(req, res, next) {
  if (req.method === "POST" && req.path === "/api/leads") {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Requisição inválida" });
    }
  }
  next();
}
app.use(validateRequest);
```

**Python:**
```python
from flask import request, jsonify

@app.before_request
def validate_request():
    if request.method == 'POST' and request.path == '/api/leads':
        if not request.is_json:
            return jsonify({'error': 'Requisição inválida'}), 400
```

## Error Handler Universal

**Node.js:**
```typescript
function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Erro interno",
    data: null
  });
}
app.use(errorHandler);
```

**Python:**
```python
@app.errorhandler(Exception)
def handle_error(error):
    return jsonify({
        'success': False,
        'message': str(error),
        'data': None
    }), getattr(error, 'status', 500)
```

## Persistência de Arquivos

**Node.js:**
```typescript
private saveToFile(): void {
  const content = JSON.stringify(Array.from(this.leads.values()), null, 2);
  if (existsSync(LEADS_FILE)) {
    copyFileSync(LEADS_FILE, BACKUP_FILE);
  }
  writeFileSync(LEADS_FILE, content, "utf-8");
}
```

**Python:**
```python
import json
import shutil

def save_to_file(self):
    content = list(self.leads.values())
    if os.path.exists(LEADS_FILE):
        shutil.copy2(LEADS_FILE, BACKUP_FILE)
    with open(LEADS_FILE, 'w', encoding='utf-8') as f:
        json.dump(content, f, indent=2, ensure_ascii=False)
```

## Scripts Utilitários

**Node.js:**
```javascript
const fs = require('fs');
const leads = JSON.parse(fs.readFileSync('leads.json', 'utf-8'));
```

**Python:**
```python
import json
with open('leads.json', 'r', encoding='utf-8') as f:
    leads = json.load(f)
```

## Execução

**Node.js:**
```bash
npm install
npm run dev
```

**Python:**
```bash
pip install flask
python app.py
# ou
flask run
```

## Dependências

**package.json:**
```json
{
  "dependencies": {
    "express": "^4.18.0"
  }
}
```

**requirements.txt:**
```txt
Flask==3.0.0
```

## Observações

- Python não possui tipagem estática nativa (use `typing` ou `pydantic`)
- Flask usa decoradores `@app.route()` ao invés de `app.post()`/`app.get()`
- Python usa snake_case ao invés de camelCase
- Promises/async-await do Node.js não são necessários em Flask básico
- O equivalente a `localStorage` no frontend permanece o mesmo
