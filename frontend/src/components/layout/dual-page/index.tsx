import React from "react";
import styles from "./styles.module.css";

interface DualPageProps {
  leftSide: React.ReactNode;
  rightSide: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
  className?: string;
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
  const containerClass = [
    styles.dualPage,
    isFixedLayout ? styles.fixedHeight : styles.autoHeight,
    className,
  ].join(" ");

  return (
    <div className={containerClass}>
      <aside className={`${styles.left} ${leftClassName}`}>{leftSide}</aside>
      <main className={`${styles.right} ${rightClassName}`}>{rightSide}</main>
    </div>
  );
}
