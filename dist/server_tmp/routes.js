"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRoutes = registerRoutes;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function registerRoutes(app) {
    const leadsFilePath = path_1.default.join(__dirname, "..", "leads.json");
    // Garante leads.json
    if (!fs_1.default.existsSync(leadsFilePath)) {
        fs_1.default.writeFileSync(leadsFilePath, "[]");
    }
    // Rota de saúde
    app.get("/", (req, res) => {
        res.json({
            status: "online",
            message: "Backend operacional.",
            timestamp: new Date().toISOString()
        });
    });
    // Registro de lead
    app.post("/leads", (req, res) => {
        try {
            const leadsData = JSON.parse(fs_1.default.readFileSync(leadsFilePath, "utf8"));
            const newLead = {
                id: Date.now(),
                ...req.body,
                createdAt: new Date().toISOString()
            };
            leadsData.push(newLead);
            fs_1.default.writeFileSync(leadsFilePath, JSON.stringify(leadsData, null, 2));
            res.status(201).json({ success: true, lead: newLead });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    });
}
