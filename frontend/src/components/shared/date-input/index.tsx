import type React from "react";

import styles from "./styles.module.css";

interface DateInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function DateInput({ value, onChange, placeholder }: DateInputProps) {
  return (
    <input
      type="date"
      id="date"
      className={styles.dateInput}
      placeholder={placeholder || "Selecionar data"}
      name="date"
      value={value}
      onChange={onChange}
    />
  );
}
