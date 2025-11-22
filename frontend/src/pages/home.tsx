import { useLocation } from "wouter";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/Button";

export default function Home() {
    const [, setLocation] = useLocation();

    const ecosystemUnits = [
        { name: "VIPNEXCORE IA", desc: "Núcleo de inteligência central", icon: "🧠" },
        { name: "VIPNEXLAB IA", desc: "Laboratório de inovação", icon: "🔬" },
        { name: "VIPNEXFIN IA", desc: "Inteligência financeira", icon: "💰" },
        { name: "VIPNEXCOMM IA", desc: "Comunicação estratégica", icon: "📡" },
        { name: "VIPNEXETH IA", desc: "Ética e governança", icon: "⚖️" },
        { name: "VIPNEXJUS IA", desc: "Conformidade legal", icon: "📜" },
        { name: "VIPNEXART IA", desc: "Criação e design", icon: "🎨" },
    ];

    const promises = [
        {
            title: "Inteligência Viva",
            desc: "IA que aprende, adapta e evolui com seu negócio",
            icon: "⚡",
        },
        {
            title: "Precisão Estrutural",
            desc: "Dados limpos, processos claros, execução perfeita",
            icon: "🎯",
        },
        {
            title: "Crescimento Contínuo",
            desc: "Escalabilidade sem fricção, expansão sem limite",
            icon: "📈",
        },
    ];

    const activations = [
        "Ganhos imediatos com automação inteligente",
        "Clareza total sobre métricas e performance",
        "Automação de processos repetitivos",
        "Velocidade de execução 10x maior",
        "Expansão estruturada e previsível",
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <img
                        src="/src/assets/MARCA-MAE-HORIZONTAL SEM FUNDO.png"
                        alt="VIPNEXUS IA"
                        className="h-10"
                    />
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setLocation("/dashboard")}
                    >
                        Dashboard
                    </Button>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                <div className="relative max-w-6xl mx-auto text-center space-y-8">
                    {/* Hologram Sphere */}
                    <div className="relative w-64 h-64 mx-auto mb-12">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600/40 to-pink-500/40 blur-2xl animate-pulse" />
                        <div className="absolute inset-4 rounded-full border-2 border-purple-500/50 animate-spin" style={{ animationDuration: "8s" }} />
                        <div className="absolute inset-8 rounded-full border border-white/20 animate-spin" style={{ animationDuration: "6s", animationDirection: "reverse" }} />
                        <div className="absolute inset-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 opacity-60" />
                    </div>

                    {/* Headlines */}
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                            Inteligência Viva.
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                Crescimento Estruturado.
                            </span>
                            <br />
                            Resultados Reais.
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                            O ecossistema VIPNEXUS IA transforma dados em decisões, automações
                            em receita, e visão em expansão contínua.
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setLocation("/dashboard")}
                        >
                            Ativar Agora
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => document.getElementById("ecosystem")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            Explorar Sistema
                        </Button>
                    </div>
                </div>
            </section>

            {/* A Promessa VIPNEXUS IA */}
            <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        A Promessa <span className="text-purple-400">VIPNEXUS IA</span>
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {promises.map((promise) => (
                            <GlassCard key={promise.title} className="p-8 text-center">
                                <div className="text-6xl mb-4">{promise.icon}</div>
                                <h3 className="text-2xl font-semibold mb-3">{promise.title}</h3>
                                <p className="text-gray-300">{promise.desc}</p>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Este é o Ecossistema */}
            <section id="ecosystem" className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Este é o <span className="text-purple-400">Ecossistema</span>
                    </h2>
                    <p className="text-xl text-gray-300 text-center mb-16 max-w-2xl mx-auto">
                        7 unidades integradas trabalhando em sincronia para transformar seu
                        negócio
                    </p>
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {ecosystemUnits.map((unit, index) => (
                            <GlassCard
                                key={unit.name}
                                variant="purple"
                                className="p-6 relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
                                <div className="relative">
                                    <div className="text-4xl mb-3">{unit.icon}</div>
                                    <h3 className="text-lg font-semibold mb-2">{unit.name}</h3>
                                    <p className="text-sm text-gray-400">{unit.desc}</p>
                                    <div className="mt-4 text-xs text-purple-400 font-mono">
                                        #{String(index + 1).padStart(2, "0")}
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* O Que Você Vai Ativar Agora */}
            <section className="py-20 px-6 bg-gradient-to-b from-black to-gray-900">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                        O Que Você Vai <span className="text-purple-400">Ativar Agora</span>
                    </h2>
                    <GlassCard className="p-10">
                        <ul className="space-y-6">
                            {activations.map((item) => (
                                <li key={item} className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <span className="text-lg text-gray-200">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </GlassCard>
                </div>
            </section>

            {/* Prévia do Dashboard */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
                        Prévia do <span className="text-purple-400">Dashboard</span>
                    </h2>
                    <p className="text-xl text-gray-300 text-center mb-16">
                        Visualize seus KPIs em tempo real
                    </p>
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                        {[
                            { label: "Leads Hoje", value: "247", change: "+12%" },
                            { label: "Conversão", value: "38%", change: "+5%" },
                            { label: "CPA", value: "R$ 12", change: "-8%" },
                            { label: "ROI", value: "340%", change: "+15%" },
                        ].map((metric) => (
                            <GlassCard key={metric.label} className="p-6">
                                <div className="text-sm text-gray-400 mb-2">{metric.label}</div>
                                <div className="text-3xl font-bold mb-1">{metric.value}</div>
                                <div className={`text-sm ${metric.change.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                                    {metric.change}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                    <div className="text-center">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => setLocation("/dashboard")}
                        >
                            Acessar Dashboard Completo
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/10">
                <div className="max-w-6xl mx-auto text-center text-gray-400">
                    <p>© 2025 VIPNEXUS IA. Inteligência Viva. Crescimento Real.</p>
                </div>
            </footer>
        </div>
    );
}
