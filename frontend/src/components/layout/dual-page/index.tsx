import React from "react";
import styles from "./styles.module.css";

interface DualPageProps {
  leftSide: React.ReactNode;
  rightSide: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
  className?: string;
  /** Se true, a página ocupa 100vh e o scroll acontece dentro dos painéis */
  isFixedLayout?: boolean;
}

export function DualPage({
  leftSide,
  rightSide,
  leftClassName = "",
  rightClassName = "",
  className = "",
  isFixedLayout = false,
}: DualPageProps) {
  // Combina classes condicionalmente
  const containerClass = [
    styles.dualPage,
    isFixedLayout ? styles.fixedHeight : styles.autoHeight,
    className,
  ].join(" ");

  return (
    <div className={containerClass}>
      {/* Lado Esquerdo (Sidebar) */}
      <aside className={`${styles.left} ${leftClassName}`}>{leftSide}</aside>

      {/* Lado Direito (Conteúdo Principal) */}
      <main className={`${styles.right} ${rightClassName}`}>{rightSide}</main>
    </div>
  );
}
