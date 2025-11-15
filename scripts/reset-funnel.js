const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(process.cwd(), 'leads.json');
const BACKUP_FILE = path.join(process.cwd(), 'leads.bak.json');

function resetFunnel() {
  let cleared = 0;

  if (fs.existsSync(LEADS_FILE)) {
    fs.unlinkSync(LEADS_FILE);
    cleared++;
    console.log('✓ leads.json removido');
  }

  if (fs.existsSync(BACKUP_FILE)) {
    fs.unlinkSync(BACKUP_FILE);
    cleared++;
    console.log('✓ leads.bak.json removido');
  }

  if (cleared === 0) {
    console.log('Nenhum arquivo para limpar');
  } else {
    console.log(`\n✓ Funil resetado com sucesso (${cleared} arquivo(s) removido(s))`);
  }
}

resetFunnel();
