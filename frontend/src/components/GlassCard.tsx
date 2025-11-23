import { ReactNode } from "react";

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    variant?: "default" | "purple" | "silver";
    hover?: boolean;
}

export default function GlassCard({
    children,
    className = "",
    variant = "default",
    hover = true,
}: GlassCardProps) {
    const variants = {
        default: "bg-white/5 border-white/10",
        purple: "bg-purple-500/10 border-purple-500/20",
        silver: "bg-gray-300/10 border-gray-300/20",
    };

    const hoverClass = hover
        ? "hover:scale-[1.02] hover:border-white/30 hover:shadow-[0_0_30px_rgba(160,32,240,0.3)]"
        : "";

    return (
        <div
            className={`
        rounded-2xl border backdrop-blur-[24px]
        transition-all duration-300 ease-out
        ${variants[variant]}
        ${hoverClass}
        ${className}
      `}
            style={{
                backdropFilter: "blur(24px) saturate(180%)",
            }}
        >
            {children}
        </div>
    );
}
