import { logo } from "../../../assets";

import styles from "./styles.module.css";

interface FormPageProps {
  children: React.ReactNode;
  className?: string;
}

export function FormPage({ children, className }: FormPageProps) {
  return (
    <div className={styles.form_page}>
      <section className={styles.form_section + " " + className}>
        {children}
      </section>
      <img src={logo} alt="logo" className={styles.logo} />
    </div>
  );
}
