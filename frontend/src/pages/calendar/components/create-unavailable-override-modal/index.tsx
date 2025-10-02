import { useEffect, useReducer } from "react";

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

type State = {
  date: Date;
  reason: string;
  error: string;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (state: State, action: any) => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.payload.field as string]: action.payload.value,
      };
    default:
      return state;
  }
};
const initialState = {
  date: new Date(),
  reason: "",
  error: "",
};

export function CreateUnavailableDayModal({
  isOpen,
  onClose,
  selectedDate,
  onCreated,
}: CreateUnavailableDayModalProps) {
  const { showMessage } = useMessage();

  const { createUnavailableDay } = useCreateUnavailableDay();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { date, reason, error } = state;

  async function handleCreateUnavailableDay(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    dispatch({ type: "field", payload: { field: "error", value: "" } });

    const unavailableDay: UnavailableDayRequestDTO = {
      date,
      reason,
    };

    const error = validateUnavailableDayRequestDTO(unavailableDay);
    if (error) {
      dispatch({ type: "field", payload: { field: "error", value: error } });
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
    if (selectedDate)
      dispatch({
        type: "field",
        payload: { field: "date", value: selectedDate },
      });
  }, [selectedDate]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.modal}>
      <h1>Criar indisponibilidade</h1>
      <hr />
      <form onSubmit={handleCreateUnavailableDay} className={styles.form}>
        <Error
          error={error}
          onClose={() =>
            dispatch({ type: "field", payload: { field: "error", value: "" } })
          }
        />
        <Input
          label="Data"
          type="date"
          value={date.toISOString().split("T")[0]}
          onChange={(e) =>
            dispatch({
              type: "field",
              payload: { field: "date", value: new Date(e.target.value) },
            })
          }
          required
        />
        <Input
          label="Motivo"
          type="text"
          value={reason}
          onChange={(e) =>
            dispatch({
              type: "field",
              payload: { field: "reason", value: e.target.value },
            })
          }
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
