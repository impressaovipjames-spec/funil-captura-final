// ======================================
// FUNIL MINIMALISTA — BACKEND EXPRESS
// INDEX FINAL — FASE 2 COMPLETA
// ======================================

const express = require("express");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const app = express();

// *** PORTA CORRIGIDA PARA FUNCIONAR NO RENDER ***
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================
// 1 — LOG SYSTEM COMPLETO
// ======================================
const logDir = path.join(__dirname, "..", "logs");
const logFile = path.join(logDir, "funnel.log");
const leadLogFile = path.join(logDir, "lead.log");
const errorLogFile = path.join(logDir, "error.log");
const reqLogFile = path.join(logDir, "requests.log");
const perfLogFile = path.join(logDir, "performance.log");

function now() {
    return new Date().toISOString();
}
function append(file, line) {
    fs.appendFile(file, line, () => {});
}

function logEvent(event, data = {}) {
    append(logFile, `[${now()}] ${event} | ${JSON.stringify(data)}\n`);
}
function logLead(lead) {
    append(leadLogFile, `[${now()}] ${JSON.stringify(lead)}\n`);
}
function logError(data) {
    append(errorLogFile, `[${now()}] ERROR | ${JSON.stringify(data)}\n`);
}
function logRequest(req) {
    const data = {
        method: req.method,
        endpoint: req.originalUrl,
        ip: req.ip,
        body: req.body,
        userAgent: req.headers["user-agent"] || "unknown"
    };
    append(reqLogFile, `[${now()}] REQUEST | ${JSON.stringify(data)}\n`);
}
function logPerformance(req, ms) {
    const data = {
        method: req.method,
        endpoint: req.originalUrl,
        ip: req.ip,
        ms,
        userAgent: req.headers["user-agent"]
    };
    append(perfLogFile, `[${now()}] PERF | ${JSON.stringify(data)}\n`);
}

// ======================================
// 2 — SANITIZAÇÃO DE INPUTS
// ======================================
function sanitize(str) {
    if (!str) return null;
    return String(str)
        .replace(/<.*?>/g, "")
        .replace(/script/gi, "")
        .replace(/['"`;]/g, "")
        .replace(/--/g, "")
        .replace(/[{}$]/g, "")
        .replace(/\/\*/g, "")
        .replace(/\*\//g, "")
        .trim();
}

// ======================================
// 3 — HARDENING DE HEADERS (SEGURANÇA)
// ======================================
app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
});

// ======================================
// 4 — COMPRESSÃO GZIP NATIVA
// ======================================
app.use((req, res, next) => {
    const gzip = zlib.createGzip();
    res.setHeader("Content-Encoding", "gzip");
    const _write = res.write;
    const _end = res.end;

    res.write = chunk => gzip.write(chunk);
    res.end = chunk => {
        if (chunk) gzip.end(chunk);
        else gzip.end();

        gzip.on("data", d => _write.call(res, d));
        gzip.on("end", () => _end.call(res));
    };
    next();
});

// ======================================
// 5 — LOG DE REQUESTS + PERFORMANCE
// ======================================
app.use((req, res, next) => {
    logRequest(req);
    const start = Date.now();

    res.on("finish", () => {
        logPerformance(req, Date.now() - start);
    });

    next();
});

// ======================================
// 6 — BLOQUEIO DE MÉTODOS PROIBIDOS
// ======================================
const allowedMethods = ["GET", "POST"];
app.use((req, res, next) => {
    if (!allowedMethods.includes(req.method)) {
        const info = {
            method: req.method,
            ip: req.ip,
            userAgent: req.headers["user-agent"]
        };
        logEvent("METHOD_BLOCKED", info);
        logError(info);
        return res.status(405).json({ error: "Método não permitido" });
    }
    next();
});

// ======================================
// 7 — ANTI-BOT LEVE
// ======================================
app.use((req, res, next) => {
    const ua = req.headers["user-agent"];
    if (!ua || ua.length < 10) {
        const info = { ip: req.ip, ua };
        logEvent("BOT_BLOCKED", info);
        logError(info);
        return res.status(403).json({ error: "Acesso negado" });
    }
    next();
});

// ======================================
// 8 — RATE LIMIT (30 REQ / MIN)
// ======================================
const rateMap = new Map();
const LIMIT = 30;
const WINDOW = 60 * 1000;

app.use((req, res, next) => {
    const ip = req.ip;
    const nowTime = Date.now();

    if (!rateMap.has(ip)) {
        rateMap.set(ip, { count: 1, start: nowTime });
        return next();
    }

    const entry = rateMap.get(ip);

    if (nowTime - entry.start > WINDOW) {
        rateMap.set(ip, { count: 1, start: nowTime });
        return next();
    }

    if (entry.count >= LIMIT) {
        const info = { ip, route: req.originalUrl };
        logEvent("RATE_LIMIT_BLOCK", info);
        logError(info);
        return res.status(429).json({ error: "Muitas requisições." });
    }

    entry.count++;
    next();
});

// ======================================
// 9 — PERSISTÊNCIA EM leads.json
// ======================================
const leadsFile = path.join(__dirname, "..", "leads.json");

function loadLeads() {
    if (!fs.existsSync(leadsFile)) return [];
    return JSON.parse(fs.readFileSync(leadsFile, "utf8"));
}

function saveLead(lead) {
    const leads = loadLeads();
    leads.push(lead);
    fs.writeFileSync(leadsFile, JSON.stringify(leads, null, 2));
}

// ======================================
// 10 — ROTAS DO FUNIL
// ======================================
app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    next();
});

app.get("/", (req, res) => {
    logEvent("PAGE_VIEW", { page: "captura", ip: req.ip });
    res.sendFile(path.join(__dirname, "..", "public", "captura.html"));
});

app.get("/confirmacao", (req, res) => {
    logEvent("PAGE_VIEW", { page: "confirmacao", ip: req.ip });
    res.sendFile(path.join(__dirname, "..", "public", "confirmacao.html"));
});

app.get("/entrega", (req, res) => {
    logEvent("PAGE_VIEW", { page: "entrega", ip: req.ip });
    res.sendFile(path.join(__dirname, "..", "public", "entrega.html"));
});

app.post("/api/leads", (req, res) => {
    try {
        const nome = sanitize(req.body.nome);
        const email = sanitize(req.body.email);

        if (!email) {
            const info = { body: req.body, ip: req.ip };
            logEvent("LEAD_ERROR", info);
            logError(info);
            return res.status(400).json({ error: "Email obrigatório" });
        }

        const lead = {
            nome: nome || null,
            email,
            userAgent: req.headers["user-agent"],
            ip: req.ip,
            createdAt: now()
        };

        saveLead(lead);
        logLead(lead);

        res.json({ success: true });
    } catch (err) {
        const info = { error: err.message };
        logEvent("SERVER_ERROR", info);
        logError(info);
        res.status(500).json({ error: "Erro interno" });
    }
});

// ======================================
// 11 — HEALTHCHECK
// ======================================
app.get("/healthcheck", (req, res) => {
    res.json({ status: "ok", time: now() });
});

// ======================================
// 12 — HANDLER GLOBAL DE ERROS
// ======================================
app.use((err, req, res, next) => {
    const errorData = {
        message: err.message,
        stack: err.stack,
        route: req.originalUrl
    };
    logError(errorData);
    res.status(500).json({ error: "Erro inesperado" });
});

// ======================================
// 13 — SERVIDOR (CORRIGIDO PARA RENDER)
// ======================================
app.listen(PORT, () => {
    logEvent("SERVER_START", { port: PORT });
    console.log(`Servidor rodando na porta ${PORT}`);
});
