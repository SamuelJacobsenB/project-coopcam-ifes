import { useMemo } from "react";
import { Card, I } from "../../../../components";
import type { BusTrip, Status } from "../../../../types";
import { TripStatusControl } from "../trip-status-control";
// Importe o componente Pizza que criamos acima ou o local onde você o definiu
import { Pizza } from "../bus-trip-graph";

import styles from "./styles.module.css";

interface SelectedBusTripCardProps {
  selectedTrip: BusTrip;
  onStatusUpdated: (status: Status) => void;
  // Opcional: Se você tiver os passageiros, pode passar aqui para calcular o gráfico real
  totalSeats?: number;
  occupiedSeats?: number;
}

export function SelectedBusTripCard({
  selectedTrip,
  onStatusUpdated,
  totalSeats = 45, // Valor padrão fictício
  occupiedSeats = 32, // Valor padrão fictício para demonstração
}: SelectedBusTripCardProps) {
  // Prepara os dados do gráfico
  const chartData = useMemo(() => {
    const freeSeats = totalSeats - occupiedSeats;

    return {
      labels: ["Ocupados", "Livres"],
      datasets: [
        {
          label: "Assentos",
          data: [occupiedSeats, freeSeats],
          backgroundColor: [
            "#0f766e", // Teal (Primary) - Ocupado
            "#e2e8f0", // Slate 200 - Livre
          ],
          borderColor: ["#fff", "#fff"],
          borderWidth: 2,
        },
      ],
    };
  }, [totalSeats, occupiedSeats]);

  return (
    <Card className={styles.cardContainer}>
      <div className={styles.contentGrid}>
        {/* Lado Esquerdo: Gráfico */}
        <div className={styles.chartWrapper}>
          <Pizza
            data={chartData}
            legendFontSize={11}
            labelDisplay={true} // Exibe a legenda ao lado
          />
        </div>

        {/* Lado Direito: Informações */}
        <div className={styles.tripInfo}>
          <div>
            <div className={styles.header}>
              <span className={styles.subTitle}>
                {selectedTrip.period === "morning"
                  ? "Turno da Manhã"
                  : "Turno da Tarde"}
              </span>
              <h1 className={styles.directionTitle}>
                {selectedTrip.direction === "go" ? "Ida" : "Volta"}
              </h1>
            </div>

            <div className={styles.metaInfo}>
              <div className={styles.metaItem}>
                <I.calendar size={14} />
                {new Date(selectedTrip.date).toLocaleDateString("pt-BR")}
              </div>
              <div className={styles.metaItem}>
                <I.clock size={14} />
                {/* Se tiver horário no objeto trip, use aqui */}
                08:00
              </div>
            </div>
          </div>

          <TripStatusControl
            trip={selectedTrip}
            onStatusUpdated={onStatusUpdated}
          />
        </div>
      </div>
    </Card>
  );
}
