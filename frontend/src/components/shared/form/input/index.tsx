import styles from "./styles.module.css";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className={styles.input_area}>
      <label htmlFor={props.name} className={styles.label}>
        {label}
      </label>
      <input className={styles.input} {...props} />
    </div>
  );
}
