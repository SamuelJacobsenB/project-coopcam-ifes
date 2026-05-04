import { I } from "../../icons";

import styles from "./styles.module.css";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const Icon = I[icon as keyof typeof I];

  return (
    <section className={styles.emptyState}>
      <Icon size={48} color="#cbd5e1" className={styles.icon} />
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
  );
}
