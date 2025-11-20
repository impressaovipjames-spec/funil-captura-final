import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

/**
 * ============================================
 * API REQUEST — VERSÃO FINAL (FASE 11)
 * Conecta corretamente o Frontend Render → Backend Render
 * ============================================
 */
export async function apiRequest(method: string, url: string, data?: any) {
  // BACKEND OFICIAL EM PRODUÇÃO — Render Web Service
  const API_URL = "https://funil-captura-final-5-rpam.onrender.com";

  const response = await fetch(`${API_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json"
    },
    body: data ? JSON.stringify(data) : undefined,
  });

  return response;
}
