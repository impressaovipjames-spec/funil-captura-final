import { Express, Request, Response } from "express";
import fs from "fs";
import path from "path";

export function registerRoutes(app: Express) {
  const leadsFilePath = path.join(__dirname, "..", "leads.json");

  // Garante leads.json
  if (!fs.existsSync(leadsFilePath)) {
    fs.writeFileSync(leadsFilePath, "[]");
  }

  // Rota de saúde
  app.get("/", (req: Request, res: Response) => {
    res.json({
      status: "online",
      message: "Backend operacional.",
      timestamp: new Date().toISOString()
    });
  });

  // Registro de lead
  app.post("/leads", (req: Request, res: Response) => {
    try {
      const leadsData = JSON.parse(fs.readFileSync(leadsFilePath, "utf8"));
      const newLead = {
        id: Date.now(),
        ...req.body,
        createdAt: new Date().toISOString()
      };
      leadsData.push(newLead);
      fs.writeFileSync(leadsFilePath, JSON.stringify(leadsData, null, 2));

      res.status(201).json({ success: true, lead: newLead });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
}
