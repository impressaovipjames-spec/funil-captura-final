import { z } from "zod";
export const insertLeadSchema = z.object({
    nome: z.string().min(1, "Nome obrigatório"),
    email: z.string().email("Email inválido"),
});
