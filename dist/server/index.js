import express from "express";
import { registerRoutes } from "./routes.js";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
// Necessário para resolver caminhos corretamente com ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.json({
    verify: (req, _res, buf) => {
        req.rawBody = buf;
    },
}));
app.use(express.urlencoded({ extended: false }));
// Middleware simples de log
app.use((req, res, next) => {
    const start = Date.now();
    const pathReq = req.path;
    const originalJson = res.json;
    res.json = function (body, ...args) {
        res._body = body;
        return originalJson.apply(res, [body, ...args]);
    };
    res.on("finish", () => {
        if (pathReq.startsWith("/api")) {
            const duration = Date.now() - start;
            const logLine = `${req.method} ${pathReq} ${res.statusCode} in ${duration}ms :: ` +
                JSON.stringify(res._body || {});
            console.log(logLine);
        }
    });
    next();
});
(async () => {
    await registerRoutes(app);
    // Error Handler
    app.use((err, _req, res, _next) => {
        const status = err.status || 500;
        res.status(status).json({
            success: false,
            message: err.message || "Erro interno",
            data: null,
        });
    });
    // ================================
    // SERVIR FRONTEND HTML PURO
    // ================================
    const publicPath = path.join(__dirname, "..", "public");
    app.use(express.static(publicPath));
    app.get("/", (_req, res) => {
        res.sendFile(path.join(publicPath, "captura.html"));
    });
    app.get("/confirmacao", (_req, res) => {
        res.sendFile(path.join(publicPath, "confirmacao.html"));
    });
    app.get("/entrega", (_req, res) => {
        res.sendFile(path.join(publicPath, "entrega.html"));
    });
    // Iniciar servidor
    const port = parseInt(process.env.PORT || "5000", 10);
    app.listen(port, "0.0.0.0", () => {
        console.log(`Servidor rodando na porta ${port}`);
    });
})();
