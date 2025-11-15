// ======================================
// FUNIL MINIMALISTA — BACKEND EXPRESS
// INDEX FINAL — FASE 7 (ARGOS VERSION)
// ======================================

const express = require("express");
const fs = require("fs");
const path = require("path");
const compression = require("compression");
const https = require("https"); // ← NECESSÁRIO PARA PRE-WARM SEGURO
const app = express();

app.set("trust proxy", true);
app.disable("x-powered-by"); // ← FASE 7

// ======================================
// CONFIGURAÇÃO BASE
// ======================================
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ======================================
// LOG SYSTEM (STREAM MODE)
// ======================================
const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, "funnel.log");
const leadLogFile = path.join(logDir, "lead.log");
const errorLogFile = path.join(logDir, "error.log");
const reqLogFile = path.join(logDir, "requests.log");
const perfLogFile = path.join(logDir, "performance.log");

const wsMain = fs.createWriteStream(logFile, { flags: "a" });
const wsLead = fs.createWriteStream(leadLogFile, { flags: "a" });
const wsError = fs.createWriteStream(errorLogFile, { flags: "a" });
const wsReq = fs.createWriteStream(reqLogFile, { flags: "a" });
const wsPerf = fs.createWriteStream(perfLogFile, { flags: "a" });

function now() { return new Date().toISOString(); }

function append(file, line) {
    if (file === logFile) return wsMain.write(line);
    if (file === leadLogFile) return wsLead.write(line);
    if (file === errorLogFile) return wsError.write(line);
    if (file === reqLogFile) return wsReq.write(line);
    if (file === perfLogFile) return wsPerf.write(line);
}

function logEvent(event, data={}) {
    append(logFile, `[${now()}] ${event} | ${JSON.stringify(data)}\n`);
}
function logLead(lead) {
    append(leadLogFile, `[${now()}] ${JSON.stringify(lead)}\n`);
}
function logError(data) {
    append(errorLogFile, `[${now()}] ERROR | ${JSON.stringify(data)}\n`);
}
function logRequest(req) {
    append(reqLogFile, `[${now()}] REQUEST | ${JSON.stringify({
        method:req.method,
        endpoint:req.originalUrl,
        ip:req.ip,
        body:req.body,
        userAgent:req.headers["user-agent"]||"unknown"
    })}\n`);
}
function logPerformance(req, ms) {
    append(perfLogFile, `[${now()}] PERF | ${JSON.stringify({
        method:req.method,
        endpoint:req.originalUrl,
        ip:req.ip,
        ms,
        userAgent:req.headers["user-agent"]
    })}\n`);
}

// ======================================
// SANITIZAÇÃO
// ======================================
function sanitize(str) {
    if (!str) return null;
    return String(str)
        .replace(/<.*?>/g,"")
        .replace(/script/gi,"")
        .replace(/['"`;]/g,"")
        .replace(/--/g,"")
        .replace(/[{}$]/g,"")
        .replace(/\/\*/g,"")
        .replace(/\*\//g,"")
        .trim();
}

// ======================================
// HEADERS DE SEGURANÇA
// ======================================
app.use((req,res,next)=>{
    res.setHeader("X-Frame-Options","DENY");
    res.setHeader("X-XSS-Protection","1; mode=block");
    res.setHeader("X-Content-Type-Options","nosniff");
    res.setHeader("Referrer-Policy","no-referrer");
    next();
});

// ======================================
// COMPRESSÃO
// ======================================
app.use(compression());

// ======================================
// LOG REQUEST + PERFORMANCE
// ======================================
app.use((req,res,next)=>{
    logRequest(req);
    const start = Date.now();
    res.on("finish",()=>logPerformance(req,Date.now()-start));
    next();
});

// ======================================
// MÉTODOS PERMITIDOS
// ======================================
app.use((req,res,next)=>{
    if(!["GET","POST"].includes(req.method)){
        logError({method:req.method,ip:req.ip});
        return res.status(405).json({error:"Método não permitido"});
    }
    next();
});

// ======================================
// ANTI-BOT (leve)
// ======================================
app.use((req,res,next)=>{
    const ua=req.headers["user-agent"];
    if(!ua || ua.length<10){
        logError({ip:req.ip,ua});
        return res.status(403).json({error:"Acesso negado"});
    }
    next();
});

// ======================================
// RATE LIMIT (global leve)
// ======================================
const rateMap=new Map();
const LIMIT=30;
const WINDOW=60000;

app.use((req,res,next)=>{
    const ip=req.ip;
    const now=Date.now();

    if(!rateMap.has(ip)){
        rateMap.set(ip,{count:1,start:now});
        return next();
    }
    const data=rateMap.get(ip);

    if(now-data.start>WINDOW){
        rateMap.set(ip,{count:1,start:now});
        return next();
    }
    if(data.count>=LIMIT){
        logError({ip,route:req.originalUrl});
        return res.status(429).json({error:"Muitas requisições"});
    }
    data.count++;
    next();
});

// ======================================
// WAF AVANÇADO — GLOBAL SEGURO
// ======================================
const blockedPayload = /(union|select|drop|insert|<script|onerror=|alert\(|\.\.\/)/i;

app.use((req, res, next) => {
    const bodyStr = JSON.stringify(req.body || {});
    if (blockedPayload.test(bodyStr) || blockedPayload.test(req.url)) {
        logError({ type: "WAF_BLOCK", ip: req.ip, body: req.body });
        return res.status(403).json({ error: "Acesso negado" });
    }
    next();
});

// Anti-scan
app.use((req,res,next)=>{
    const ua = req.headers["user-agent"] || "";
    if(/(python|curl|scraper|httpclient|spider|bot)/i.test(ua)){
        logError({ip:req.ip,ua});
        return res.status(403).json({error:"Bloqueado"});
    }
    next();
});

// ======================================
// QUEUE LITE + FAIL-SAFE COMPLETO
// ======================================
const queue=[];
let processing=false;
const QUEUE_LIMIT=5000;

let watchdogCounter=0;
const WATCHDOG_RESET=30000;

function processQueue(){
    if(processing||queue.length===0)return;
    processing=true;

    const job=queue.shift();
    Promise.resolve(job.fn())
        .catch(err=>append(errorLogFile,`[${now()}] QUEUE_ERROR | ${err}\n`))
        .finally(()=>{
            processing=false;
            setImmediate(processQueue);
        });
}

function enqueue(fn){
    if(queue.length>=QUEUE_LIMIT){
        append(errorLogFile,`[${now()}] QUEUE_OVERFLOW | drop\n`);
        return;
    }
    watchdogCounter++;
    queue.push({fn});
    processQueue();
}

// Loop breaker
setInterval(()=>{
    if(watchdogCounter>20000){
        append(errorLogFile,`[${now()}] LOOP_BREAKER | reset\n`);
        watchdogCounter=0;
    }
},1000);

// Watchdog
setInterval(()=>{
    if(processing && queue.length===0){
        processing=false;
        append(errorLogFile,`[${now()}] WATCHDOG_RESET\n`);
    }
},WATCHDOG_RESET);

// ======================================
// LOG CLEANER
// ======================================
setInterval(()=>{
    const maxSize=5*1024*1024;
    [logFile,leadLogFile,errorLogFile,reqLogFile,perfLogFile].forEach(f=>{
        try{
            if(fs.existsSync(f) && fs.statSync(f).size>maxSize){
                fs.writeFileSync(f,"");
                append(f,`[${now()}] LOG_ROTATE\n`);
            }
        }catch(err){
            append(errorLogFile,`[${now()}] LOG_CLEAN_ERROR | ${err}\n`);
        }
    });
},300000);

// ======================================
// PERSISTÊNCIA DE LEADS
// ======================================
const leadsFile = path.join(__dirname,"..","leads.json");

function loadLeads(){
    if(!fs.existsSync(leadsFile))return[];
    return JSON.parse(fs.readFileSync(leadsFile,"utf8"));
}

function saveLead(lead){
    const leads=loadLeads();
    leads.push(lead);
    fs.writeFileSync(leadsFile,JSON.stringify(leads,null,2));
}

// ======================================
// BOOT INSTANTÂNEO + MICRO CACHE
// ======================================
app.use((req,res,next)=>{
    res.setHeader("Server","ARGOS-FUNIL");
    res.setHeader("X-Powered-By","ARGOS-Core");

    if(/\.(js|css|png|jpg|svg)$/.test(req.url)){
        res.setHeader("Cache-Control","public,max-age=300");
    }
    next();
});

// ======================================
// ROTAS
// ======================================
app.use((req,res,next)=>{
    res.setHeader("Cache-Control","no-store");
    next();
});

app.get("/",(req,res)=>{
    logEvent("PAGE_VIEW",{page:"captura",ip:req.ip});
    res.sendFile(path.join(__dirname,"..","public","captura.html"));
});

app.get("/confirmacao",(req,res)=>{
    logEvent("PAGE_VIEW",{page:"confirmacao",ip:req.ip});
    res.sendFile(path.join(__dirname,"..","public","confirmacao.html"));
});

app.get("/entrega",(req,res)=>{
    logEvent("PAGE_VIEW",{page:"entrega",ip:req.ip});
    res.sendFile(path.join(__dirname,"..","public","entrega.html"));
});

// ======================================
// ROTA DE LEADS (fila + fail-safe)
// ======================================
app.post("/api/leads",(req,res)=>{
    enqueue(()=>{
        return new Promise(resolve=>{
            try{
                const nome=sanitize(req.body.nome);
                const email=sanitize(req.body.email);

                if(!email){
                    logError({body:req.body,ip:req.ip});
                    res.status(400).json({error:"Email obrigatório"});
                    return resolve();
                }

                const lead={
                    nome:nome||null,
                    email,
                    userAgent:req.headers["user-agent"],
                    ip:req.ip,
                    createdAt:now()
                };

                saveLead(lead);
                logLead(lead);

                res.json({success:true});
                resolve();

            }catch(err){
                logError({error:err.message});
                res.status(500).json({error:"Erro interno"});
                resolve();
            }
        });
    });
});

// ======================================
// HEALTHCHECKS
// ======================================
app.get("/healthcheck",(req,res)=>res.json({status:"ok",time:now()}));
app.get("/healthz",(req,res)=>res.status(200).json({status:"ok",time:now()}));

// ======================================
// PRE-WARM (Render Free) — FASE 7 FINAL
// ======================================
const PREWARM_URL = "https://funil-captura-final.onrender.com/healthz";

setInterval(() => {
    try {
        https.get(PREWARM_URL, res => {
            append(perfLogFile, `[${now()}] PREWARM | OK | STATUS ${res.statusCode}\n`);
        }).on("error", err => {
            append(errorLogFile, `[${now()}] PREWARM_FAIL | ${err.message}\n`);
        });
    } catch (err) {
        append(errorLogFile, `[${now()}] PREWARM_CRASH | ${err.message}\n`);
    }
}, 60000);

// ======================================
// CRASH HANDLERS
// ======================================
process.on("uncaughtException",err=>{
    append(errorLogFile,`[${now()}] FATAL_UNCAUGHT | ${err.stack}\n`);
});
process.on("unhandledRejection",reason=>{
    append(errorLogFile,`[${now()}] FATAL_UNHANDLED | ${reason}\n`);
});

// ======================================
// SERVIDOR
// ======================================
app.listen(PORT,()=>{
    logEvent("SERVER_START",{port:PORT});
    console.log("Servidor rodando na porta "+PORT);
});
