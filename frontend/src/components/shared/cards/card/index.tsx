import type React from "react";

import styles from "./styles.module.css";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div className={`${className} ${styles.card}`} onClick={onClick}>
      {children}
    </div>
  );
}
