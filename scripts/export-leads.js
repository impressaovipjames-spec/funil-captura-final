const fs = require('fs');
const path = require('path');

const LEADS_FILE = path.join(process.cwd(), 'leads.json');
const CSV_FILE = path.join(process.cwd(), 'leads.csv');

function exportLeadsToCSV() {
  if (!fs.existsSync(LEADS_FILE)) {
    console.log('Arquivo leads.json não encontrado.');
    return;
  }

  try {
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    const leads = JSON.parse(data);

    if (leads.length === 0) {
      console.log('Nenhum lead encontrado em leads.json');
      return;
    }

    const headers = 'id,nome,email\n';
    const rows = leads.map(lead => 
      `${lead.id},${lead.nome},${lead.email}`
    ).join('\n');

    const csv = headers + rows;
    fs.writeFileSync(CSV_FILE, csv, 'utf-8');

    console.log(`✓ Exportação concluída: ${leads.length} leads salvos em leads.csv`);
  } catch (error) {
    console.error('Erro ao exportar leads:', error.message);
  }
}

exportLeadsToCSV();
