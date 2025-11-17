export default function NotFound() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "60px auto",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "20px", color: "#d00" }}>
        Página não encontrada
      </h1>

      <p style={{ fontSize: "18px", color: "#555", marginBottom: "30px" }}>
        O conteúdo que você tentou acessar não existe.
      </p>

      <a
        href="/"
        style={{
          display: "inline-block",
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "16px",
        }}
      >
        Voltar ao início
      </a>
    </div>
  );
}
