import type React from "react";
import styles from "./styles.module.css";

// Estende as props padrão de uma div (permite passar id, role, onMouseOver, etc.)
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "elevated" | "outlined";
  className?: string;
}

export function Card({
  children,
  className = "",
  variant = "elevated",
  onClick,
  ...props
}: CardProps) {
  // Monta as classes condicionalmente
  const cardClasses = [
    styles.card,
    styles[variant],
    onClick ? styles.interactive : "", // Só adiciona efeitos de hover se for clicável
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props} // Repassa as outras props (ex: id, aria-label)
    >
      {children}
    </div>
  );
}
