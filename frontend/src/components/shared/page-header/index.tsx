import styles from "./styles.module.css";

interface PageHeaderProps {
  title: string;
  description: string;
  size?: number;
}

export function PageHeader({ title, description, size = 1 }: PageHeaderProps) {
  return (
    <div className={styles.headerText}>
      <h1 style={{ fontSize: `${1.5 + (size - 1) * 0.25}rem` }}>{title}</h1>
      <p style={{ fontSize: `${0.875 + (size - 1) * 0.075}rem` }}>
        {description}
      </p>
    </div>
  );
}
