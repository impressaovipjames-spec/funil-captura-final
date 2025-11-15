#!/bin/bash
# Funil de Captura - Script Bash
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

# Ver conteúdo de leads.json (formatado)
# cat leads.json | jq .

# Ver conteúdo de leads.bak.json (formatado)
# cat leads.bak.json | jq .

# Ver conteúdo de leads.json (sem formatação)
# cat leads.json

# Contar leads
# cat leads.json | jq 'length'

# ==============================================
# COMANDOS ÚTEIS
# ==============================================

# Verificar se porta 5000 está em uso
# lsof -i :5000

# Matar processo na porta 5000
# kill -9 $(lsof -t -i :5000)

# Verificar versão do Node.js
# node --version

# Verificar versão do npm
# npm --version

# Listar arquivos JSON
# ls -lh *.json

# Ver tamanho dos arquivos de dados
# du -h leads.json leads.bak.json 2>/dev/null || echo "Arquivos não existem"

# ==============================================
# CURL - TESTAR API MANUALMENTE
# ==============================================

# Health check
# curl http://localhost:5000/healthcheck

# Criar lead
# curl -X POST http://localhost:5000/api/leads \
#   -H "Content-Type: application/json" \
#   -d '{"nome":"Test User","email":"test@example.com"}'

# Listar leads
# curl http://localhost:5000/api/leads

# Debug - Ver leads.json
# curl http://localhost:5000/leads

# ==============================================
# PERMISSÕES
# ==============================================

# Tornar scripts executáveis
# chmod +x scripts/*.js
# chmod +x tests/*.js
# chmod +x local-run.sh

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

# 6. Ver dados exportados
#    cat leads.csv

# 7. Limpar dados
#    node scripts/reset-funnel.js
