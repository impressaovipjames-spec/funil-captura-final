const fs = require('fs');
const path = require('path');

const SEEDS_FILE = path.join(process.cwd(), 'seeds.json');
const LEADS_FILE = path.join(process.cwd(), 'leads.json');
const BACKUP_FILE = path.join(process.cwd(), 'leads.bak.json');

function seedLeads() {
  if (!fs.existsSync(SEEDS_FILE)) {
    console.error('Erro: seeds.json não encontrado');
    process.exit(1);
  }

  try {
    const seedData = fs.readFileSync(SEEDS_FILE, 'utf-8');
    const leads = JSON.parse(seedData);

    if (fs.existsSync(LEADS_FILE)) {
      fs.copyFileSync(LEADS_FILE, BACKUP_FILE);
      console.log('✓ Backup criado em leads.bak.json');
    }

    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    console.log(`✓ ${leads.length} leads importados para leads.json`);
    console.log('\nLeads importados:');
    leads.forEach(lead => {
      console.log(`  - ${lead.nome} (${lead.email})`);
    });
  } catch (error) {
    console.error('Erro ao importar seeds:', error.message);
    process.exit(1);
  }
}

seedLeads();
