import { Express, Request, Response } from "express";
import { storage } from "./storage";
import { insertLeadSchema } from "../shared/schema";

export async function registerRoutes(app: Express) {

  // Healthcheck
  app.get("/healthcheck", (_req: Request, res: Response) => {
    res.json({ success: true, message: "ok", data: null });
  });

  // Listar leads
  app.get("/api/leads", async (_req: Request, res: Response) => {
    const leads = await storage.getAllLeads();
    res.json({
      success: true,
      message: "Lista de leads",
      data: leads,
    });
  });

  // Criar lead
  app.post("/api/leads", async (req: Request, res: Response) => {
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

    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message || "Erro ao criar lead",
        data: null,
      });
    }
  });

  return app;
}
