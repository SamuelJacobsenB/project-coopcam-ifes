import { useState } from "react";

import { useMessage } from "../../../../contexts";
import { useUpdateBusTrip } from "../../../../hooks";
import type { BusTrip, Status } from "../../../../types";

import styles from "./styles.module.css";

interface TripStatusControlProps {
  trip: BusTrip;
  onStatusUpdated: (status: Status) => void;
}

export function TripStatusControl({
  trip,
  onStatusUpdated,
}: TripStatusControlProps) {
  const { updateBusTrip } = useUpdateBusTrip();
  const { showMessage } = useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions: { value: Status; label: string }[] = [
    { value: "unstarted", label: "Não iniciado" },
    { value: "started", label: "Em andamento" },
    { value: "finished", label: "Finalizado" },
  ];

  const handleStatusChange = async (newStatus: Status) => {
    if (newStatus === trip.status) return;

    setIsLoading(true);
    try {
      const updated = await updateBusTrip({
        id: trip.id,
        busTrip: {
          date: null,
          period: null,
          direction: null,
          status: newStatus,
        },
      });

      showMessage("Status atualizado com sucesso", "success");
      onStatusUpdated(updated.status);
    } catch {
      showMessage("Erro ao atualizar status da viagem", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <label htmlFor="status-select" className={styles.label}>
        Status da Operação
      </label>
      <div className={styles.selectWrapper}>
        <select
          id="status-select"
          className={styles.select}
          value={trip.status}
          onChange={(e) => handleStatusChange(e.target.value as Status)}
          disabled={isLoading}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {isLoading && <div className={styles.loader} />}
      </div>
    </div>
  );
}
