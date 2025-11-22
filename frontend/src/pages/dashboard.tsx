import { useState } from "react";
import { useLocation } from "wouter";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";

export default function Dashboard() {
    const [, setLocation] = useLocation();
    const [funnelTemp] = useState(85); // 0-100

    const getTempColor = (temp: number) => {
        if (temp >= 70) return "text-green-400";
        if (temp >= 40) return "text-yellow-400";
        return "text-red-400";
    };

    const getTempStatus = (temp: number) => {
        if (temp >= 70) return "Sistema Otimizado";
        if (temp >= 40) return "Atenção Necessária";
        return "Intervenção Urgente";
    };

    const metrics = [
        { label: "Leads do Dia", value: "247", change: "+12%", positive: true },
        { label: "Conversão Total", value: "38.4%", change: "+5.2%", positive: true },
        { label: "CPA Médio", value: "R$ 12.40", change: "-8.1%", positive: true },
        { label: "Receita Projetada", value: "R$ 84.2k", change: "+18%", positive: true },
        { label: "ROI Real", value: "340%", change: "+15%", positive: true },
        { label: "ROI Alvo", value: "280%", change: "—", positive: null },
        { label: "Ativações Pendentes", value: "3", change: "—", positive: null },
    ];

    const quickCommands = [
        { label: "Criar Campanha", icon: "🚀", action: () => alert("Criar Campanha") },
        { label: "Lançar Automação", icon: "⚡", action: () => alert("Lançar Automação") },
        { label: "Subir Criativo", icon: "🎨", action: () => alert("Subir Criativo") },
        { label: "Ver Relatórios", icon: "📊", action: () => alert("Ver Relatórios") },
    ];

    const argosInsights = [
        {
            type: "Previsão",
            message: "Conversão deve aumentar 12% nos próximos 7 dias",
            confidence: "Alta",
        },
        {
            type: "Risco",
            message: "CPA pode subir 5% se não ajustar lances",
            confidence: "Média",
        },
        {
            type: "Recomendação",
            message: "Ativar campanha de retargeting para leads frios",
            confidence: "Alta",
        },
    ];

    const traxisReports = [
        { name: "Overview Semanal", date: "21/11/2025", status: "Pronto" },
        { name: "Deep Dive Técnico", date: "20/11/2025", status: "Pronto" },
        { name: "Projeção 30 dias", date: "19/11/2025", status: "Processando" },
        { name: "Projeção 60 dias", date: "19/11/2025", status: "Aguardando" },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <img
                            src="/src/assets/MARCA-MAE-VERTICAL SEM FUNDO.png"
                            alt="VIPNEXUS IA"
                            className="h-10"
                        />
                        <nav className="hidden md:flex gap-6">
                            <button className="text-gray-300 hover:text-white transition">Dashboard</button>
                            <button className="text-gray-300 hover:text-white transition">Campanhas</button>
                            <button className="text-gray-300 hover:text-white transition">Relatórios</button>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => setLocation("/")}>
                            ← Home
                        </Button>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold">
                            M
                        </div>
                    </div>
                </div>
            </header>

            <div className="pt-24 px-6 pb-12">
                <div className="max-w-7xl mx-auto">
                    {/* Page Title */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold mb-2">Dashboard VIPNEXUS IA</h1>
                        <p className="text-gray-400">Visão completa do seu ecossistema</p>
                    </div>

                    {/* Painel Central - KPIs */}
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold mb-6">Painel Central</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                            {metrics.map((metric) => (
                                <GlassCard key={metric.label} className="p-4">
                                    <div className="text-xs text-gray-400 mb-2">{metric.label}</div>
                                    <div className="text-2xl font-bold mb-1">{metric.value}</div>
                                    {metric.positive !== null && (
                                        <div
                                            className={`text-xs ${metric.positive ? "text-green-400" : "text-red-400"
                                                }`}
                                        >
                                            {metric.change}
                                        </div>
                                    )}
                                </GlassCard>
                            ))}
                        </div>
                    </section>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Temperatura do Funil */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-6">Temperatura do Funil</h2>
                                <GlassCard className="p-8">
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-48 h-48 mb-6">
                                            {/* Progress Ring */}
                                            <svg className="w-full h-full transform -rotate-90">
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="88"
                                                    stroke="rgba(255,255,255,0.1)"
                                                    strokeWidth="12"
                                                    fill="none"
                                                />
                                                <circle
                                                    cx="96"
                                                    cy="96"
                                                    r="88"
                                                    stroke="url(#gradient)"
                                                    strokeWidth="12"
                                                    fill="none"
                                                    strokeDasharray={`${2 * Math.PI * 88}`}
                                                    strokeDashoffset={`${2 * Math.PI * 88 * (1 - funnelTemp / 100)}`}
                                                    strokeLinecap="round"
                                                    className="transition-all duration-1000"
                                                />
                                                <defs>
                                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                        <stop offset="0%" stopColor="#10b981" />
                                                        <stop offset="100%" stopColor="#3b82f6" />
                                                    </linearGradient>
                                                </defs>
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <div className={`text-5xl font-bold ${getTempColor(funnelTemp)}`}>
                                                    {funnelTemp}%
                                                </div>
                                                <div className="text-sm text-gray-400 mt-2">Temperatura</div>
                                            </div>
                                        </div>
                                        <div className={`text-xl font-semibold ${getTempColor(funnelTemp)}`}>
                                            {getTempStatus(funnelTemp)}
                                        </div>
                                    </div>
                                </GlassCard>
                            </section>

                            {/* Comando Rápido */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-6">Comando Rápido</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {quickCommands.map((cmd) => (
                                        <GlassCard
                                            key={cmd.label}
                                            className="p-6 text-center cursor-pointer"
                                            hover={true}
                                            onClick={cmd.action}
                                        >
                                            <div className="text-4xl mb-3">{cmd.icon}</div>
                                            <div className="text-sm font-medium">{cmd.label}</div>
                                        </GlassCard>
                                    ))}
                                </div>
                            </section>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* ARGOS MODE */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                                    <span className="text-purple-400">ARGOS</span> MODE
                                </h2>
                                <GlassCard variant="purple" className="p-6">
                                    <div className="space-y-4">
                                        {argosInsights.map((insight, index) => (
                                            <div key={index} className="pb-4 border-b border-white/10 last:border-0 last:pb-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <span className="text-xs font-semibold text-purple-400 uppercase">
                                                        {insight.type}
                                                    </span>
                                                    <span className="text-xs text-gray-400">{insight.confidence}</span>
                                                </div>
                                                <p className="text-sm text-gray-200">{insight.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </section>

                            {/* Relatórios TRAXIS */}
                            <section>
                                <h2 className="text-2xl font-semibold mb-6">Relatórios TRAXIS</h2>
                                <GlassCard className="p-6">
                                    <div className="space-y-3">
                                        {traxisReports.map((report) => (
                                            <div
                                                key={report.name}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition cursor-pointer"
                                            >
                                                <div>
                                                    <div className="text-sm font-medium">{report.name}</div>
                                                    <div className="text-xs text-gray-400">{report.date}</div>
                                                </div>
                                                <div
                                                    className={`text-xs px-2 py-1 rounded ${report.status === "Pronto"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : report.status === "Processando"
                                                                ? "bg-yellow-500/20 text-yellow-400"
                                                                : "bg-gray-500/20 text-gray-400"
                                                        }`}
                                                >
                                                    {report.status}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </GlassCard>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
