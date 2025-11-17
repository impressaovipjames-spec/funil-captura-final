import { storage } from "./storage.js";
import { insertLeadSchema } from "../shared/schema.js";
export async function registerRoutes(app) {
    // Healthcheck
    app.get("/healthcheck", (_req, res) => {
        res.json({ success: true, message: "ok", data: null });
    });
    // Listar leads
    app.get("/api/leads", async (_req, res) => {
        const leads = await storage.getAllLeads();
        res.json({
            success: true,
            message: "Lista de leads",
            data: leads,
        });
    });
    // Criar lead
    app.post("/api/leads", async (req, res) => {
        try {
            const parsed = insertLeadSchema.parse(req.body);
            const nome = parsed.nome.trim();
            const email = parsed.email.trim().toLowerCase();
            const newLead = await storage.createLead({
                nome,
                email,
            });
            res.json({
                success: true,
                message: "Lead criado com sucesso",
                data: newLead,
            });
        }
        catch (err) {
            res.status(400).json({
                success: false,
                message: err.message || "Erro ao criar lead",
                data: null,
            });
        }
    });
    return app;
}
