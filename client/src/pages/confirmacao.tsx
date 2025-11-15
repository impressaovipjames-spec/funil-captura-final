import { Link } from "wouter";
import { useEffect, useState } from "react";

export default function Confirmacao() {
  const [nome, setNome] = useState("");

  useEffect(() => {
    const leadNome = localStorage.getItem("leadNome");
    if (leadNome) {
      setNome(leadNome);
    }
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", textAlign: "center" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#28a745" }}>
        Cadastro Confirmado{nome ? `, ${nome}` : ""}!
      </h1>
      <p style={{ fontSize: "16px", marginBottom: "30px", color: "#333" }}>
        Seus dados foram recebidos com sucesso.
      </p>
      <Link href="/entrega">
        <a
          data-testid="link-entrega"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            fontSize: "16px",
            backgroundColor: "#007bff",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          Acessar Conteúdo
        </a>
      </Link>
    </div>
  );
}
