import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}

export default function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    ...props
}: ButtonProps) {
    const variants = {
        primary:
            "bg-gradient-to-r from-purple-600 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-900/40 hover:shadow-purple-900/60 hover:scale-105",
        secondary:
            "bg-transparent border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/40",
        ghost:
            "bg-transparent text-white hover:bg-white/5 hover:shadow-[0_0_20px_rgba(160,32,240,0.2)]",
    };

    const sizes = {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
    };

    return (
        <button
            className={`
        rounded-xl font-semibold
        transition-all duration-300 ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
            {...props}
        >
            {children}
        </button>
    );
}
