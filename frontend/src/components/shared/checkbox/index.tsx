import styles from "./styles.module.css";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, ...props }: CheckboxProps) {
  return (
    <label className={styles.checkbox_container}>
      <input type="checkbox" className={styles.checkbox_input} {...props} />
      <span className={styles.label_text}>{label}</span>
    </label>
  );
}
