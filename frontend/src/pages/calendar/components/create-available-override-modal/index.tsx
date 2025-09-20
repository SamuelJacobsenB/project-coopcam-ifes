import { useEffect, useState } from "react";

import { useMessage } from "../../../../contexts";
import { useCreateAvailableOverride } from "../../../../hooks";
import { Error, Input, Modal } from "../../../../components";
import { validateAvailableOverrideRequestDTO } from "../../../../utils";
import type { AvailableOverrideRequestDTO } from "../../../../types";

import styles from "./styles.module.css";

interface CreateAvailableOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export function CreateAvailableOverrideModal({
  isOpen,
  onClose,
  selectedDate,
}: CreateAvailableOverrideModalProps) {
  const { showMessage } = useMessage();

  const { createAvailableOverride } = useCreateAvailableOverride();

  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function handleCreateAvailableOverride(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    const availableOverride: AvailableOverrideRequestDTO = {
      date: new Date(date),
      reason,
    };

    const error = validateAvailableOverrideRequestDTO(availableOverride);
    if (error) {
      setError(error);
      return;
    }

    try {
      await createAvailableOverride(availableOverride);

      showMessage("Disponibilidade criada com sucesso", "success");
    } catch {
      showMessage("Erro ao criar disponibilidade", "error");
    }
  }

  useEffect(() => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      setDate(formattedDate);
    }
  }, [selectedDate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <h1>Criar disponibilidade</h1>
      <hr />
      <form onSubmit={handleCreateAvailableOverride} className={styles.form}>
        <Error error={error} onClose={() => setError("")} />
        <Input
          label="Data"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Input
          label="Motivo"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Motivo da disponibilidade"
          required
        />
        <button type="submit" className="btn btn-success">
          Cadastrar
        </button>
      </form>
    </Modal>
  );
}
