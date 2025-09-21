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
  onCreated: () => Promise<void>;
}

export function CreateUnavailableDayModal({
  isOpen,
  onClose,
  selectedDate,
  onCreated,
}: CreateUnavailableDayModalProps) {
  const { showMessage } = useMessage();

  const { createUnavailableDay } = useCreateUnavailableDay();

  const [date, setDate] = useState(new Date());
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function handleCreateUnavailableDay(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");

    const unavailableDay: UnavailableDayRequestDTO = {
      date,
      reason,
    };

    const error = validateUnavailableDayRequestDTO(unavailableDay);
    if (error) {
      setError(error);
      return;
    }

    try {
      await createUnavailableDay(unavailableDay);
      await onCreated().then((a) => console.log(a));
      onClose();

      showMessage("Indisponibilidade criada com sucesso", "success");
    } catch {
      showMessage("Erro ao criar indisponibilidade", "error");
    }
  }

  useEffect(() => {
    if (selectedDate) setDate(selectedDate);
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
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
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
