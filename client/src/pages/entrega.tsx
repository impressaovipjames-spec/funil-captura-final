import { useEffect, useState } from "react";

const highlights = [
  "Blueprint estratégico com roteiro semanal",
  "Playbooks de copy para cada etapa do funil",
  "Checklist técnico para integrações e automações",
];

export default function Entrega() {
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
        data-track="view_entrega"
        className="relative mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10 lg:px-12 lg:py-20"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="animate-pulse absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-violet-500/20 blur-[150px]" />
          <div className="animate-pulse absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-blue-500/20 blur-[170px]" />
        </div>

        <section className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-900/40 backdrop-blur-xl">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.35em] text-indigo-200">
              Conteúdo liberado
            </p>
            <h1 className="text-4xl font-semibold text-white sm:text-5xl">
              Boas-vindas ao seu cockpit de conversão{greeting}
            </h1>
            <p className="max-w-3xl text-lg text-slate-200">
              Aqui está o material premium que revela o passo a passo para ativar campanhas
              inteligentes, nutrir leads e transformar interesse em receita. Salve este
              link e revisite sempre que precisar reforçar sua operação.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-white/5 bg-black/20 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Materiais principais
              </p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                {highlights.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-3 transition hover:-translate-y-0.5"
                  >
                    <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/5 bg-black/20 p-6">
              <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Próximos passos
              </p>
              <ol className="space-y-3 text-sm text-slate-200">
                <li className="rounded-2xl bg-white/5 p-3">
                  01. Faça o download do blueprint em PDF e compartilhe com seu time.
                </li>
                <li className="rounded-2xl bg-white/5 p-3">
                  02. Configure os gatilhos prioritários e valide o fluxo em staging.
                </li>
                <li className="rounded-2xl bg-white/5 p-3">
                  03. Agende uma revisão de performance após 7 dias para otimizar.
                </li>
              </ol>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-black/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
                Arquivo principal
              </p>
              <h2 className="text-2xl font-semibold text-white">Funil High Conversion</h2>
              <p className="text-sm text-slate-300">
                Download imediato com templates editáveis e vídeo walkthrough.
              </p>
            </div>
            <a
              data-track="cta_entrega"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01] focus-visible:outline-none"
              href="/assets/funil-high-conversion.pdf"
              download
            >
              Baixar blueprint
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
