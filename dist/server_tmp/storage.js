"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.MemStorage = void 0;
const crypto_1 = require("crypto");
const fs_1 = require("fs");
const path_1 = require("path");
const LEADS_FILE = (0, path_1.join)(process.cwd(), "leads.json");
const BACKUP_FILE = (0, path_1.join)(process.cwd(), "leads.bak.json");
class MemStorage {
    constructor() {
        this.leads = new Map();
        this.loadFromFile();
    }
    loadFromFile() {
        if ((0, fs_1.existsSync)(LEADS_FILE)) {
            try {
                const data = (0, fs_1.readFileSync)(LEADS_FILE, "utf-8");
                const list = JSON.parse(data);
                list.forEach((l) => this.leads.set(l.id, l));
            }
            catch (err) {
                console.error("Erro ao carregar leads.json:", err);
            }
        }
    }
    saveToFile() {
        try {
            const array = Array.from(this.leads.values());
            const content = JSON.stringify(array, null, 2);
            if ((0, fs_1.existsSync)(LEADS_FILE)) {
                (0, fs_1.copyFileSync)(LEADS_FILE, BACKUP_FILE);
            }
            (0, fs_1.writeFileSync)(LEADS_FILE, content, "utf-8");
        }
        catch (err) {
            console.error("Erro ao salvar leads.json:", err);
        }
    }
    async createLead(data) {
        const id = (0, crypto_1.randomUUID)();
        const lead = { id, ...data };
        this.leads.set(id, lead);
        this.saveToFile();
        return lead;
    }
    async getAllLeads() {
        return Array.from(this.leads.values());
    }
}
exports.MemStorage = MemStorage;
exports.storage = new MemStorage();
