import { randomUUID } from "crypto";
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "fs";
import { join } from "path";

export interface Lead {
  id: string;
  nome: string;
  email: string;
}

export interface InsertLead {
  nome: string;
  email: string;
}

const LEADS_FILE = join(process.cwd(), "leads.json");
const BACKUP_FILE = join(process.cwd(), "leads.bak.json");

export class MemStorage {
  private leads: Map<string, Lead>;

  constructor() {
    this.leads = new Map();
    this.loadFromFile();
  }

  private loadFromFile(): void {
    if (existsSync(LEADS_FILE)) {
      try {
        const data = readFileSync(LEADS_FILE, "utf-8");
        const list: Lead[] = JSON.parse(data);
        list.forEach((l) => this.leads.set(l.id, l));
      } catch (err) {
        console.error("Erro ao carregar leads.json:", err);
      }
    }
  }

  private saveToFile(): void {
    try {
      const array = Array.from(this.leads.values());
      const content = JSON.stringify(array, null, 2);

      if (existsSync(LEADS_FILE)) {
        copyFileSync(LEADS_FILE, BACKUP_FILE);
      }

      writeFileSync(LEADS_FILE, content, "utf-8");
    } catch (err) {
      console.error("Erro ao salvar leads.json:", err);
    }
  }

  async createLead(data: InsertLead): Promise<Lead> {
    const id = randomUUID();
    const lead: Lead = { id, ...data };
    this.leads.set(id, lead);
    this.saveToFile();
    return lead;
  }

  async getAllLeads(): Promise<Lead[]> {
    return Array.from(this.leads.values());
  }
}

export const storage = new MemStorage();
