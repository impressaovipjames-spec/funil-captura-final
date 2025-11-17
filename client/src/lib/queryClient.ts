import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export async function apiRequest(method: string, url: string, data?: any) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: data ? JSON.stringify(data) : undefined,
  });

  return response;
}
