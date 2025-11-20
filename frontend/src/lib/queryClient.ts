import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function apiRequest(method: string, url: string, data?: any) {
  // URL OFICIAL DO BACKEND EM PRODUÇÃO (Render)
  const API_URL = "https://funil-captura-final-5-rpam.onrender.com";

  const response = await fetch(`${API_URL}${url}`, {
    method,
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });

  return response;
}
