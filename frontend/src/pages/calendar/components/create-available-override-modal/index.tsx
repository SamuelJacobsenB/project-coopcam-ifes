import { useEffect, useReducer } from "react";

import { Error, Input, Modal } from "../../../../components";
import { useMessage } from "../../../../contexts";
import { useCreateAvailableOverride } from "../../../../hooks";
import type { AvailableOverrideRequestDTO } from "../../../../types";
import { validateAvailableOverrideRequestDTO } from "../../../../utils";

import styles from "./styles.module.css";

interface CreateAvailableOverrideModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: Date;
  onCreated: () => Promise<void>;
}

interface OverrideFormState {
  date: Date;
  reason: string;
  error: string;
}

type OverrideFormAction =
  | {
      type: "field";
      payload: { field: keyof OverrideFormState; value: string | Date };
    }
  | { type: "reset" };

const reducer = (
  state: OverrideFormState,
  action: OverrideFormAction,
): OverrideFormState => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.payload.field]: action.payload.value,
      };
    case "reset":
      return {
        date: new Date(),
        reason: "",
        error: "",
      };
    default:
      return state;
  }
};

const initialState: OverrideFormState = {
  date: new Date(),
  reason: "",
  error: "",
};

export function CreateAvailableOverrideModal({
  isOpen,
  onClose,
  selectedDate,
  onCreated,
}: CreateAvailableOverrideModalProps) {
  const { showMessage } = useMessage();

  const { createAvailableOverride } = useCreateAvailableOverride();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { date, reason, error } = state;

  async function handleCreateAvailableOverride(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    dispatch({ type: "field", payload: { field: "error", value: "" } });

    const availableOverride: AvailableOverrideRequestDTO = {
      date,
      reason,
    };

    const error = validateAvailableOverrideRequestDTO(availableOverride);
    if (error) {
      dispatch({ type: "field", payload: { field: "error", value: error } });
      return;
    }

    try {
      await createAvailableOverride(availableOverride);
      await onCreated();
      onClose();

      showMessage("Disponibilidade criada com sucesso", "success");
    } catch {
      showMessage("Erro ao criar disponibilidade", "error");
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
      <h1>Criar disponibilidade</h1>
      <hr />
      <form onSubmit={handleCreateAvailableOverride} className={styles.form}>
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
