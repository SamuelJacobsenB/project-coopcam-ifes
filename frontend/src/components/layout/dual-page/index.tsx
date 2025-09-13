import styles from "./styles.module.css";

interface DualPageProps {
  leftSide: React.ReactNode;
  rightSide: React.ReactNode;
  leftClassName?: string;
  rightClassName?: string;
}

export function DualPage({
  leftSide,
  rightSide,
  leftClassName,
  rightClassName,
}: DualPageProps) {
  return (
    <>
      <div className={styles.dualPage}>
        <section className={`${styles.left} ${leftClassName}`}>
          {leftSide}
        </section>
        <section className={`${styles.right} ${rightClassName}`}>
          {rightSide}
        </section>
      </div>
    </>
  );
}
