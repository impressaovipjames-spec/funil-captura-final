import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Captura() {
  const [, setLocation] = useLocation();
  const form = useForm({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      nome: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { nome: string; email: string }) => {
      const res = await apiRequest("POST", "/api/leads", data);
      return await res.json();
    },
    onSuccess: (response) => {
      if (response.success && response.data) {
        localStorage.setItem("leadNome", response.data.nome);
        setLocation("/confirmacao");
      }
    },
  });

  const onSubmit = (data: { nome: string; email: string }) => {
    mutation.mutate(data);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px", textAlign: "center" }}>
        Cadastre-se
      </h1>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="nome"
            style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}
          >
            Nome
          </label>
          <input
            data-testid="input-nome"
            id="nome"
            type="text"
            {...form.register("nome")}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          {form.formState.errors.nome && (
            <span style={{ color: "#d00", fontSize: "14px" }}>
              {form.formState.errors.nome.message}
            </span>
          )}
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label
            htmlFor="email"
            style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}
          >
            Email
          </label>
          <input
            data-testid="input-email"
            id="email"
            type="email"
            {...form.register("email")}
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
          {form.formState.errors.email && (
            <span style={{ color: "#d00", fontSize: "14px" }}>
              {form.formState.errors.email.message}
            </span>
          )}
        </div>

        <button
          data-testid="button-submit"
          type="submit"
          disabled={mutation.isPending}
          style={{
            width: "100%",
            padding: "12px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: mutation.isPending ? "not-allowed" : "pointer",
          }}
        >
          {mutation.isPending ? "Enviando..." : "Cadastrar"}
        </button>
      </form>
    </div>
  );
}
