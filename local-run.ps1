# Funil de Captura - Script PowerShell
# Este script contém comandos organizados para gerenciar o funil
# NÃO executa automaticamente - use os comandos individualmente

# ==============================================
# INSTALAÇÃO
# ==============================================

# Instalar dependências
# npm install

# ==============================================
# EXECUTAR SERVIDOR
# ==============================================

# Iniciar servidor de desenvolvimento
# npm run dev

# Servidor estará disponível em http://localhost:5000

# ==============================================
# POPULAR COM DADOS DE EXEMPLO
# ==============================================

# Importar leads de seeds.json
# node scripts/seed-leads.js

# ==============================================
# TESTES
# ==============================================

# Executar testes manuais (servidor deve estar rodando)
# node tests/manual-tests.js

# ==============================================
# EXPORTAR DADOS
# ==============================================

# Exportar leads para CSV
# node scripts/export-leads.js

# Arquivo leads.csv será criado na raiz do projeto

# ==============================================
# RESET/LIMPEZA
# ==============================================

# Limpar todos os leads (remove leads.json e leads.bak.json)
# node scripts/reset-funnel.js

# ==============================================
# DEBUG
# ==============================================

# Ver conteúdo de leads.json
# Get-Content leads.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Ver conteúdo de leads.bak.json
# Get-Content leads.bak.json | ConvertFrom-Json | ConvertTo-Json -Depth 10

# Contar leads
# (Get-Content leads.json | ConvertFrom-Json).Count

# ==============================================
# COMANDOS ÚTEIS
# ==============================================

# Verificar se porta 5000 está em uso
# Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

# Matar processo na porta 5000
# Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process

# Verificar versão do Node.js
# node --version

# Verificar versão do npm
# npm --version

# Listar arquivos JSON
# Get-ChildItem -Filter *.json

# ==============================================
# EXEMPLO DE FLUXO COMPLETO
# ==============================================

# 1. Instalar
#    npm install

# 2. Popular com dados de exemplo
#    node scripts/seed-leads.js

# 3. Iniciar servidor
#    npm run dev

# 4. (Em outro terminal) Executar testes
#    node tests/manual-tests.js

# 5. Exportar para CSV
#    node scripts/export-leads.js

# 6. Limpar dados
#    node scripts/reset-funnel.js
