import { useEffect, useState } from "react";

import { useMessage } from "../../../../contexts";
import { useCreateUnavailableDay } from "../../../../hooks";
import { Error, Input, Modal } from "../../../../components";
import { validateUnavailableDayRequestDTO } from "../../../../utils";
import type { UnavailableDayRequestDTO } from "../../../../types";

import styles from "./styles.module.css";

interface CreateUnavailableDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
}

export function CreateUnavailableDayModal({
  isOpen,
  onClose,
  selectedDate,
}: CreateUnavailableDayModalProps) {
  const { showMessage } = useMessage();

  const { createUnavailableDay } = useCreateUnavailableDay();

  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function handleCreateUnavailableDay(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    const unavailableDay: UnavailableDayRequestDTO = {
      date: new Date(date),
      reason,
    };

    const error = validateUnavailableDayRequestDTO(unavailableDay);
    if (error) {
      setError(error);
      return;
    }

    try {
      await createUnavailableDay(unavailableDay);

      showMessage("Indisponibilidade criada com sucesso", "success");
    } catch {
      showMessage("Erro ao criar indisponibilidade", "error");
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
      <h1>Criar indisponibilidade</h1>
      <hr />
      <form onSubmit={handleCreateUnavailableDay} className={styles.form}>
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
