# Funil de Captura Minimalista

Sistema simples de captura de leads com 3 páginas: captura → confirmação → entrega.

## Estrutura

```
├── server/
│   ├── routes.ts       # Rotas da API
│   ├── storage.ts      # Armazenamento em memória + arquivo
│   └── index.ts        # Servidor Express
├── client/src/pages/
│   ├── captura.tsx     # Formulário de cadastro
│   ├── confirmacao.tsx # Página de confirmação
│   └── entrega.tsx     # Página de entrega
├── scripts/
│   ├── export-leads.js # Exportar leads para CSV
│   ├── reset-funnel.js # Limpar todos os leads
│   └── seed-leads.js   # Popular banco com dados de exemplo
├── tests/
│   └── manual-tests.js # Testes manuais da API
├── shared/
│   └── schema.ts       # Validação com Zod
├── seeds.json          # Dados de exemplo para popular
├── leads.json          # Armazenamento de leads (gerado automaticamente)
├── leads.bak.json      # Backup automático (gerado automaticamente)
├── postman-collection.json  # Collection Postman/Insomnia
├── local-run.sh        # Script Bash com comandos organizados
├── local-run.ps1       # Script PowerShell com comandos organizados
├── flow-diagram.md     # Diagramas de fluxo em Mermaid
├── api-spec.md         # Documentação completa da API
└── migration-notes.md  # Guia de migração para Python/Flask
```

## Executar

```bash
npm install
npm run dev
```

Acesse: http://localhost:5000

## Scripts de Linha de Comando

### Linux/Mac
```bash
# Ver comandos disponíveis
cat local-run.sh

# Dar permissão de execução (se necessário)
chmod +x local-run.sh
```

### Windows PowerShell
```powershell
# Ver comandos disponíveis
Get-Content local-run.ps1
```

## Rotas da API

- `POST /api/leads` - Criar novo lead
- `GET /api/leads` - Listar todos os leads
- `GET /leads` - Debug: conteúdo de leads.json
- `GET /healthcheck` - Status do servidor

Ver `api-spec.md` para documentação completa.

## Scripts Utilitários

```bash
# Popular banco com dados de exemplo
node scripts/seed-leads.js

# Exportar leads para CSV
node scripts/export-leads.js

# Resetar funil (limpar todos os leads)
node scripts/reset-funnel.js
```

## Testes

```bash
# Executar testes manuais (servidor deve estar rodando)
node tests/manual-tests.js
```

**Testes incluídos:**
- Health check
- Criação de lead
- Validação de email com regex
- Campos obrigatórios
- Sanitização de entrada
- Listar leads
- Criação de backup automático
- Respostas padronizadas

## Postman/Insomnia

Importe `postman-collection.json` no Postman ou Insomnia para testar todas as rotas com exemplos de request/response pré-configurados.

## Diagramas de Fluxo

Ver `flow-diagram.md` para visualizar:
- Fluxo completo do funil
- Fluxo de dados e armazenamento
- Validação em camadas
- Rotas da API
- Fluxo de testes
- Ciclo de vida do lead
- Backup e recuperação

Use um visualizador Mermaid online ou extensões de editor para renderizar os diagramas.

## Funcionalidades

- ✓ Validação de email com regex
- ✓ Sanitização de entrada (remove <>)
- ✓ Persistência em arquivo JSON
- ✓ Backup automático a cada save
- ✓ Placeholders dinâmicos (nome do lead)
- ✓ Middleware de validação
- ✓ Tratamento de erros universal
- ✓ Respostas padronizadas (success, message, data)
- ✓ Dados de exemplo (seeds.json)
- ✓ Testes manuais sem frameworks
- ✓ Collection Postman/Insomnia
- ✓ Scripts organizados (Bash + PowerShell)
- ✓ Diagramas de fluxo Mermaid

## Documentação

- **README.md** - Este arquivo (visão geral do projeto)
- **api-spec.md** - Blueprint completo da API com exemplos
- **migration-notes.md** - Guia para migrar para Python/Flask
- **flow-diagram.md** - Diagramas de fluxo em Mermaid
- **ESTRUTURA-FUNIL.txt** - Descrição detalhada da estrutura
- **postman-collection.json** - Collection para testar API
- **local-run.sh** - Comandos organizados para Linux/Mac
- **local-run.ps1** - Comandos organizados para Windows

## Tecnologias

- Backend: Express.js + TypeScript
- Frontend: React + Wouter
- Validação: Zod + Regex nativo
- Armazenamento: Memória + JSON
- Testes: Node.js http nativo

## Observações

Projeto minimalista sem banco de dados, autenticação ou complexidade adicional.
