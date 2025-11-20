import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";
import cors from "cors";

const app = express();
app.set("trust proxy", true);
app.disable("x-powered-by");

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "https://funil-captura-final-5-rpam.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

const logDir = path.join(__dirname, "..", "logs");
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

const logFile = path.join(logDir, "server.log");
const writeLog = (msg: string) =>
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);

const leadsFilePath = path.join(__dirname, "..", "leads.json");
if (!fs.existsSync(leadsFilePath)) fs.writeFileSync(leadsFilePath, "[]");

// ROOT
app.get("/", (_, res) => {
  res.json({
    status: "online",
    message: "Backend operacional.",
    timestamp: new Date().toISOString(),
  });
});

// LEADS
app.post("/leads", (req, res) => {
  try {
    const leadsData = JSON.parse(fs.readFileSync(leadsFilePath, "utf8"));
    const newLead = {
      id: Date.now(),
      ...req.body,
      createdAt: new Date().toISOString(),
    };
    leadsData.push(newLead);
    fs.writeFileSync(leadsFilePath, JSON.stringify(leadsData, null, 2));
    res.status(201).json({ success: true, lead: newLead });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {});
