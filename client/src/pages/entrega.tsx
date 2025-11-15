import { useEffect, useState } from "react";

export default function Entrega() {
  const [nome, setNome] = useState("");

  useEffect(() => {
    const leadNome = localStorage.getItem("leadNome");
    if (leadNome) {
      setNome(leadNome);
    }
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
        Página de Entrega{nome ? ` - Olá, ${nome}` : ""}
      </h1>
      <p style={{ fontSize: "16px", marginBottom: "15px", color: "#333" }}>
        Conteúdo placeholder para entrega.
      </p>
      <p style={{ fontSize: "16px", color: "#666" }}>
        Este espaço será preenchido com o material do funil.
      </p>
    </div>
  );
}
