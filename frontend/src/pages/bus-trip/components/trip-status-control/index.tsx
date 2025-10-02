import { useState } from "react";

import { useMessage } from "../../../../contexts";
import { useUpdateBusTrip } from "../../../../hooks";
import { getNextStatus, getPreviousStatus } from "../../../../utils";
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

  const nextStatus = getNextStatus(trip.status);
  const previousStatus = getPreviousStatus(trip.status);

  const handleStatusChange = async (
    newStatus: "unstarted" | "started" | "finished"
  ) => {
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
    <div>
      <p>
        <strong>Status atual:</strong>{" "}
        {trip.status === "unstarted"
          ? "Não iniciado"
          : trip.status === "started"
          ? "Iniciado"
          : "Finalizado"}
      </p>

      <div className={styles.buttonGroup}>
        {previousStatus && (
          <button
            className="btn-sm btn-secondary"
            onClick={() => handleStatusChange(previousStatus)}
            disabled={isLoading}
          >
            Voltar
          </button>
        )}

        {nextStatus && (
          <button
            className="btn-sm btn-primary"
            onClick={() => handleStatusChange(nextStatus)}
            disabled={isLoading}
          >
            {trip.status === "unstarted" ? "Iniciar" : "Finalizar"}
          </button>
        )}
      </div>
    </div>
  );
}
