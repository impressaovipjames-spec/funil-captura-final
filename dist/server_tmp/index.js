"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.set("trust proxy", true);
app.disable("x-powered-by");
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)({
    origin: "https://funil-captura-final-5-rpam.onrender.com",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, compression_1.default)());
const logDir = path_1.default.join(__dirname, "..", "logs");
if (!fs_1.default.existsSync(logDir))
    fs_1.default.mkdirSync(logDir);
const logFile = path_1.default.join(logDir, "server.log");
const writeLog = (msg) => fs_1.default.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
const leadsFilePath = path_1.default.join(__dirname, "..", "leads.json");
if (!fs_1.default.existsSync(leadsFilePath))
    fs_1.default.writeFileSync(leadsFilePath, "[]");
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
        const leadsData = JSON.parse(fs_1.default.readFileSync(leadsFilePath, "utf8"));
        const newLead = {
            id: Date.now(),
            ...req.body,
            createdAt: new Date().toISOString(),
        };
        leadsData.push(newLead);
        fs_1.default.writeFileSync(leadsFilePath, JSON.stringify(leadsData, null, 2));
        res.status(201).json({ success: true, lead: newLead });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});
app.listen(PORT, () => { });
