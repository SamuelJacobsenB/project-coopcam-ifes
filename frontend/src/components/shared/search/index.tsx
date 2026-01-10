import type React from "react";
import { I } from "../../icons";
import styles from "./styles.module.css";

interface SearchProps {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear?: () => void; // Nova prop para limpar a busca
  placeholder?: string;
}

export function Search({
  onSubmit,
  value,
  onChange,
  onClear,
  placeholder,
}: SearchProps) {
  return (
    <form onSubmit={onSubmit} className={styles.searchWrapper} role="search">
      <label className={styles.searchLabel} htmlFor="search-input">
        <I.search aria-hidden="true" />
      </label>
      <input
        type="text"
        id="search-input"
        className={styles.searchInput}
        placeholder={placeholder || "Buscar..."}
        name="search"
        value={value}
        onChange={onChange}
        autoComplete="off"
      />

      {/* Botão para limpar a busca se houver texto */}
      {value && onClear && (
        <button
          type="button"
          className={styles.clearButton}
          onClick={onClear}
          aria-label="Limpar pesquisa"
        >
          <I.close size={16} /> {/* Assumindo que I.close existe */}
        </button>
      )}
    </form>
  );
}
