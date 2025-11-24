import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "../../shared/schema.ts";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

type LeadPayload = { nome: string; email: string };

const benefits = [
  {
    title: "Fluxo Inteligente",
    description:
      "Configure jornadas automatizadas que nutrem seus contatos no momento certo.",
    icon: "⚡️",
  },
  {
    title: "Segmentação Avançada",
    description:
      "Aplique filtros dinâmicos e personalize mensagens conforme o comportamento.",
    icon: "🎯",
  },
  {
    title: "Insights em Tempo Real",
    description:
      "Acompanhe métricas de conversão e ajuste campanhas com rapidez.",
    icon: "📊",
  },
];

const testimonials = [
  {
    name: "Marina S.",
    role: "Head de Growth",
    quote:
      "Duplicamos a taxa de conversão em 45 dias graças à análise e automações desta plataforma.",
  },
  {
    name: "Daniel R.",
    role: "Founder @ Escala Digital",
    quote:
      "Onboarding simples, integrações rápidas e suporte estratégico. Virou nosso hub de leads.",
  },
];

function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-900/30 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300/50 ${className}`}
    >
      {children}
    </div>
  );
}

export default function Captura() {
  const [, setLocation] = useLocation();
  const form = useForm<LeadPayload>({
    resolver: zodResolver(insertLeadSchema),
    defaultValues: {
      nome: "",
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: LeadPayload) => {
      const res = await apiRequest("POST", "/leads", data);
      return await res.json();
    },
    onSuccess: (response) => {
      if (response.success && response.lead) {
        localStorage.setItem("leadNome", response.lead.nome);
        setLocation("/confirmacao");
      }
    },
  });

  const onSubmit = (data: LeadPayload) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 from-slate-950 via-slate-900 to-slate-950 bg-gradient-to-br text-slate-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-pulse absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-[150px]" />
        <div className="animate-pulse absolute bottom-0 right-0 h-80 w-80 translate-x-1/3 rounded-full bg-blue-500/20 blur-[180px]" />
      </div>

      <main
        data-track="view"
        className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 py-16 sm:px-10 lg:py-20"
      >
        <section className="grid items-start gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1 text-sm font-medium text-slate-100 backdrop-blur">
              Novo Playbook de Conversão 2024
            </span>
            <div className="space-y-6">
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
                Capture leads qualificados com uma jornada personalizada, rápida
                e mensurável.
              </h1>
              <p className="text-lg text-slate-200">
                Combine segmentação avançada, gatilhos inteligentes e relatórios
                em tempo real para destravar crescimento previsível. Seja o
                primeiro a experimentar o lançamento oficial.
              </p>
            </div>
            <dl className="flex flex-wrap gap-6 text-sm text-slate-200">
              <div className="space-y-1 rounded-2xl border border-white/5 px-4 py-3">
                <dt className="text-slate-400">Leads nutridos</dt>
                <dd className="text-2xl font-semibold text-white">+120k</dd>
              </div>
              <div className="space-y-1 rounded-2xl border border-white/5 px-4 py-3">
                <dt className="text-slate-400">Taxa média</dt>
                <dd className="text-2xl font-semibold text-white">38% CTR</dd>
              </div>
              <div className="space-y-1 rounded-2xl border border-white/5 px-4 py-3">
                <dt className="text-slate-400">Integrações</dt>
                <dd className="text-2xl font-semibold text-white">50+</dd>
              </div>
            </dl>
          </div>

          {/* FORMULÁRIO MOVIDO PARA O TOPO */}
          <GlassCard className="relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-500/20 blur-3xl" />
            <p className="text-sm uppercase tracking-widest text-indigo-200">
              Comece agora
            </p>
            <h3 className="mt-3 text-2xl font-semibold text-white">
              Liberamos convites a cada semana.
            </h3>
            <p className="mt-2 text-sm text-slate-300">
              Garanta seu lugar e receba o blueprint completo do funil high
              ticket + checklist de nutrição.
            </p>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-8 space-y-6"
            >
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium text-white">
                  Nome completo
                </label>
                <div className="group flex items-center rounded-2xl border border-white/10 bg-black/20 px-4 transition focus-within:border-indigo-400">
                  <input
                    data-testid="input-nome"
                    id="nome"
                    type="text"
                    {...form.register("nome")}
                    className="w-full bg-transparent py-4 text-base text-white placeholder:text-slate-400 focus-visible:outline-none"
                    placeholder="Digite seu nome"
                  />
                </div>
                {form.formState.errors.nome && (
                  <p className="text-sm text-rose-400">
                    {form.formState.errors.nome.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">
                  Email profissional
                </label>
                <div className="group flex items-center rounded-2xl border border-white/10 bg-black/20 px-4 transition focus-within:border-indigo-400">
                  <input
                    data-testid="input-email"
                    id="email"
                    type="email"
                    {...form.register("email")}
                    className="w-full bg-transparent py-4 text-base text-white placeholder:text-slate-400 focus-visible:outline-none"
                    placeholder="nome@empresa.com"
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-sm text-rose-400">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                data-testid="button-submit"
                data-track="lead_submit"
                type="submit"
                disabled={mutation.isPending}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-6 py-4 text-lg font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:scale-[1.01] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              >
                {mutation.isPending ? "Enviando..." : "Quero receber acesso"}
              </button>
              <p className="text-center text-xs text-slate-400">
                Respeitamos sua privacidade. Você pode sair da lista quando
                quiser.
              </p>
            </form>
          </GlassCard>
        </section>

        {/* Prova Social movida para baixo */}
        <section>
          <GlassCard className="relative overflow-hidden max-w-4xl mx-auto">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-indigo-500/20 blur-3xl" />
            <p className="mb-6 text-sm uppercase tracking-[0.2rem] text-indigo-200">
              Prova Social
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl border border-white/5 bg-white/5 p-5 text-sm italic text-slate-100 transition hover:bg-white/10"
                >
                  "{testimonial.quote}"
                  <div className="mt-4 text-xs uppercase tracking-wide text-slate-300 not-italic">
                    {testimonial.name} · {testimonial.role}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          {benefits.map((benefit) => (
            <GlassCard key={benefit.title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-2xl">
                {benefit.icon}
              </div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm text-slate-200">{benefit.description}</p>
            </GlassCard>
          ))}
        </section>

        <section className="grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="order-2 space-y-6 text-slate-200 lg:order-1">
            <div>
              <p className="text-sm uppercase tracking-widest text-indigo-200">
                Comunidade que converte
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-white">
                “É como ter um time de growth 24/7 acompanhando seus leads.”
              </h2>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Automação ativada em minutos com templates validados e copy
                sugerida.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Painéis de performance prontos para apresentar à diretoria.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                Suporte humano e plano de crescimento personalizado.
              </li>
            </ul>
          </GlassCard>
        </section>
      </main>
    </div>
  );
}
