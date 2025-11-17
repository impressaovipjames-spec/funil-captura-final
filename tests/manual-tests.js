const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';
const LEADS_FILE = path.join(process.cwd(), 'leads.json');
const BACKUP_FILE = path.join(process.cwd(), 'leads.bak.json');

let testsPassed = 0;
let testsFailed = 0;

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      headers: {}
    };

    if (data) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

function assert(condition, testName) {
  if (condition) {
    console.log(`✓ ${testName}`);
    testsPassed++;
  } else {
    console.error(`✗ ${testName}`);
    testsFailed++;
  }
}

async function test1_healthcheck() {
  console.log('\n--- Test 1: GET /healthcheck ---');
  const response = await request('GET', '/healthcheck');
  assert(response.status === 200, 'Status deve ser 200');
  assert(response.data.status === 'ok', 'Status deve ser "ok"');
}

async function test2_createLead() {
  console.log('\n--- Test 2: POST /api/leads (sucesso) ---');
  const leadData = {
    nome: 'Test User',
    email: 'test@example.com'
  };
  
  const response = await request('POST', '/api/leads', leadData);
  assert(response.status === 200, 'Status deve ser 200');
  assert(response.data.success === true, 'success deve ser true');
  assert(response.data.data.nome === 'Test User', 'Nome deve corresponder');
  assert(response.data.data.email === 'test@example.com', 'Email deve corresponder');
  assert(response.data.data.id !== undefined, 'ID deve existir');
}

async function test3_invalidEmail() {
  console.log('\n--- Test 3: POST /api/leads (email inválido) ---');
  const leadData = {
    nome: 'Test User',
    email: 'invalid-email'
  };
  
  const response = await request('POST', '/api/leads', leadData);
  assert(response.status === 400, 'Status deve ser 400');
  assert(response.data.success === false, 'success deve ser false');
  assert(response.data.message.includes('Email inválido'), 'Mensagem deve mencionar email inválido');
}

async function test4_missingFields() {
  console.log('\n--- Test 4: POST /api/leads (campos faltando) ---');
  const leadData = { nome: 'Test User' };
  
  const response = await request('POST', '/api/leads', leadData);
  assert(response.status === 400, 'Status deve ser 400');
  assert(response.data.success === false, 'success deve ser false');
}

async function test5_sanitization() {
  console.log('\n--- Test 5: Sanitização de entrada ---');
  const leadData = {
    nome: '<script>Test</script>',
    email: 'test<>@example.com'
  };
  
  const response = await request('POST', '/api/leads', leadData);
  assert(response.status === 200, 'Status deve ser 200');
  assert(!response.data.data.nome.includes('<'), 'Nome não deve conter <');
  assert(!response.data.data.nome.includes('>'), 'Nome não deve conter >');
  assert(!response.data.data.email.includes('<'), 'Email não deve conter <');
  assert(!response.data.data.email.includes('>'), 'Email não deve conter >');
}

async function test6_getLeads() {
  console.log('\n--- Test 6: GET /api/leads ---');
  const response = await request('GET', '/api/leads');
  assert(response.status === 200, 'Status deve ser 200');
  assert(response.data.success === true, 'success deve ser true');
  assert(Array.isArray(response.data.data), 'data deve ser um array');
  assert(response.data.data.length >= 2, 'Deve ter pelo menos 2 leads');
}

async function test7_backupCreation() {
  console.log('\n--- Test 7: Criação de backup ---');
  
  if (fs.existsSync(BACKUP_FILE)) {
    fs.unlinkSync(BACKUP_FILE);
  }
  
  const leadData = {
    nome: 'Backup Test',
    email: 'backup@example.com'
  };
  
  await request('POST', '/api/leads', leadData);
  
  const backupExists = fs.existsSync(BACKUP_FILE);
  assert(backupExists, 'leads.bak.json deve ser criado');
  
  if (backupExists) {
    const backupContent = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf-8'));
    assert(Array.isArray(backupContent), 'Backup deve conter array');
  }
}

async function test8_emailValidationRegex() {
  console.log('\n--- Test 8: Validação de email com regex ---');
  
  const validEmails = [
    'test@example.com',
    'user.name@domain.co.uk',
    'user+tag@example.org'
  ];
  
  const invalidEmails = [
    'invalid',
    '@example.com',
    'user@',
    'user@domain',
    'user domain@example.com'
  ];
  
  for (const email of validEmails) {
    const response = await request('POST', '/api/leads', { nome: 'Test', email });
    assert(response.status === 200, `Email válido deve ser aceito: ${email}`);
  }
  
  for (const email of invalidEmails) {
    const response = await request('POST', '/api/leads', { nome: 'Test', email });
    assert(response.status === 400, `Email inválido deve ser rejeitado: ${email}`);
  }
}

async function test9_standardizedResponses() {
  console.log('\n--- Test 9: Respostas padronizadas ---');
  
  const response = await request('POST', '/api/leads', {
    nome: 'Standard Test',
    email: 'standard@example.com'
  });
  
  assert(response.data.hasOwnProperty('success'), 'Deve ter propriedade success');
  assert(response.data.hasOwnProperty('message'), 'Deve ter propriedade message');
  assert(response.data.hasOwnProperty('data'), 'Deve ter propriedade data');
  assert(typeof response.data.success === 'boolean', 'success deve ser boolean');
  assert(typeof response.data.message === 'string', 'message deve ser string');
}

async function runTests() {
  console.log('='.repeat(50));
  console.log('Iniciando testes manuais...');
  console.log('='.repeat(50));
  
  try {
    await test1_healthcheck();
    await test2_createLead();
    await test3_invalidEmail();
    await test4_missingFields();
    await test5_sanitization();
    await test6_getLeads();
    await test7_backupCreation();
    await test8_emailValidationRegex();
    await test9_standardizedResponses();
    
    console.log('\n' + '='.repeat(50));
    console.log(`Resultados: ${testsPassed} passaram, ${testsFailed} falharam`);
    console.log('='.repeat(50));
    
    process.exit(testsFailed > 0 ? 1 : 0);
  } catch (error) {
    console.error('\nErro ao executar testes:', error.message);
    console.error('Certifique-se de que o servidor está rodando em http://localhost:5000');
    process.exit(1);
  }
}

runTests();
