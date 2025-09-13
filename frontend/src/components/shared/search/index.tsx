import type React from "react";

import { I } from "../../icons";

import styles from "./styles.module.css";

interface SearchProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export function Search({
  onSubmit,
  value,
  onChange,
  placeholder,
}: SearchProps) {
  return (
    <form onSubmit={onSubmit} className={styles.searchWrapper}>
      <label className={styles.searchLabel} htmlFor="search">
        <I.search />
      </label>
      <input
        type="text"
        id="search"
        className={styles.searchInput}
        placeholder={placeholder || "Buscar..."}
        name="search"
        value={value}
        onChange={onChange}
      />
    </form>
  );
}
