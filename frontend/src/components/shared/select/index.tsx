import styles from "./styles.module.css";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
}

export function Select({ label, options, ...props }: SelectProps) {
  return (
    <div className={styles.input_area}>
      <label htmlFor={props.name} className={styles.label}>
        {label}
      </label>
      <select className={styles.input} {...props}>
        <option value="" disabled>
          Selecione uma opção
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
