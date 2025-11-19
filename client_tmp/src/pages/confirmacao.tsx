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

  const greeting = nome ? `, ${nome}` : "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <main
        data-track="view_confirmacao"
        className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-16 sm:px-10 lg:px-12 lg:py-20"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-pulse absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[160px]" />
          <div className="animate-pulse absolute bottom-0 right-0 h-64 w-64 translate-x-1/3 rounded-full bg-indigo-500/20 blur-[160px]" />
        </div>

        <section className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl">
          <div className="space-y-4 text-center">
            <p className="text-sm uppercase tracking-[0.4em] text-emerald-300">
              Confirmação realizada
            </p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
              Cadastro confirmado{greeting}!
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-200">
              Sua jornada de alto desempenho começa agora. Enviamos um resumo com os
              próximos passos e liberamos o acesso ao material especial para acelerar sua
              estratégia de captura.
            </p>
          </div>

          <div className="grid gap-6 rounded-2xl border border-white/5 bg-black/20 p-6 text-sm text-slate-200 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Tempo médio para ativar funil
              </p>
              <p className="text-2xl font-semibold text-white">18 min</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Recurso bônus liberado
              </p>
              <p className="text-2xl font-semibold text-white">Checklist Pro</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Próxima etapa
              </p>
              <p className="text-2xl font-semibold text-white">Acessar conteúdo</p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/entrega">
              <a
                data-testid="link-entrega"
                data-track="cta_entrega"
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 via-indigo-500 to-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.02] focus-visible:outline-none"
              >
                Acessar conteúdo exclusivo
              </a>
            </Link>
            <p className="text-sm text-slate-400">
              Fique atento ao seu email para receber atualizações prioritárias.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
