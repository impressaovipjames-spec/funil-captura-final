/**
 * ======================================
 * FUNIL CAPTURA FINAL — BACKEND EXPRESS
 * SERVER FINAL — FASE 11 (ARGOS VERSION)
 * ======================================
 */

const express = require("express");
const fs = require("fs");
const path = require("path");
const compression = require("compression");
const cors = require("cors");
const app = express();

app.set("trust proxy", true);
app.disable("x-powered-by");

// ======================================
// CONFIGURAÇÃO BASE
// ======================================
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// ======================================
// CORS — CONFIGURAÇÃO OFICIAL (FASE 11)
// ======================================
app.use(
  cors({
    origin: "https://funil-captura-final-5.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ======================================
// LOG SYSTEM (STREAM MODE) — CORRIGIDO
// ======================================
const logDir = path.join(__dirname, "logs");

// Garante que a pasta exista
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logFile = path.join(logDir, "server.log");

// Função de log segura
function writeLog(message) {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${message}\n`);
}

// ======================================
// PATH DO ARQUIVO DE LEADS
// ======================================
const leadsFilePath = path.join(__dirname, "leads.json");

// Garante a existência do leads.json
if (!fs.existsSync(leadsFilePath)) {
  fs.writeFileSync(leadsFilePath, "[]");
}

// ======================================
// ROTA PRINCIPAL (STATUS DO SERVIDOR)
// ======================================
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Backend operacional.",
    timestamp: new Date().toISOString(),
  });
});

// ======================================
// ROTA — REGISTRO DE LEAD
// ======================================
app.post("/leads", (req, res) => {
  writeLog("Chamada recebida (POST /leads).");

  try {
    const leadsData = JSON.parse(fs.readFileSync(leadsFilePath, "utf8"));

    const newLead = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
      ip: req.ip,
    };

    leadsData.push(newLead);

    fs.writeFileSync(leadsFilePath, JSON.stringify(leadsData, null, 2));

    writeLog("Lead salvo com sucesso.");
    res.status(201).json({ success: true, lead: newLead });
  } catch (error) {
    writeLog("Erro ao salvar lead: " + error.message);
    res.status(500).json({ success: false, error: "Erro interno." });
  }
});

// ======================================
// ROTA GET /leads — LISTAR LEADS
// ======================================
app.get("/leads", (req, res) => {
  fs.readFile(leadsFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler leads.json:", err);
      return res.status(500).json({ error: "Erro ao ler leads." });
    }

    try {
      const leads = JSON.parse(data || "[]");
      return res.json({ total: leads.length, leads });
    } catch (e) {
      console.error("Erro ao interpretar leads.json:", e);
      return res.status(500).json({ error: "Erro ao interpretar dados." });
    }
  });
});

// ======================================
// START SERVER
// ======================================
app.listen(PORT, () => {
  writeLog(`Servidor iniciado na porta ${PORT}`);
  console.log(`Servidor online na porta ${PORT}`);
});
