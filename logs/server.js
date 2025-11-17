// server.js — FASE 3 (ESM, minimal, seguro, rápido)

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// Correção de __dirname em ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir front minimal
app.use(express.static(path.join(__dirname, "public")));

// Endpoint de teste
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Backend FASE 3 (ESM) rodando na porta " + PORT);
});
