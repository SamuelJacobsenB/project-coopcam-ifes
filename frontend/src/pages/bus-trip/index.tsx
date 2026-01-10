import { useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

import {
  useBusTripById,
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
import {
  Card,
  DateInput,
  DualPage,
  I,
  Navbar,
  Private,
} from "../../components";
import { isSameDate, parseDateInput } from "../../utils";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

import { BusReportsCard, BusReservationsCard, BusTripCard } from "./components";

import styles from "./styles.module.css";

interface State {
  date: Date;
  trips: BusTrip[];
  reservations: BusReservation[];
  reports: BusTripReport[];
  selectedTrip: BusTrip | null;
}
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
const initialState: State = {
  date: new Date(),
  trips: [],
  reservations: [],
  reports: [],
  selectedTrip: null,
};

export function BusTripPage() {
  const { id } = useParams();

  const { getBusTripById } = useBusTripById();
  const { getManyBusTripsByDate } = useManyBusTripsByDate();
  const { getManyBusReservationsByDate } = useManyBusReservationsByDate();
  const { getManyBusTripReportsByDate } = useManyBusTripReportsByDate();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { date, trips, selectedTrip, reservations, reports } = state;

  useEffect(() => {
    const strDate = date.toISOString().split("T")[0];

    getManyBusTripsByDate(strDate).then((trips) =>
      dispatch({ type: "field", payload: { field: "trips", value: trips } })
    );
    getManyBusTripReportsByDate(strDate).then((reports) =>
      dispatch({ type: "field", payload: { field: "reports", value: reports } })
    );
    getManyBusReservationsByDate(strDate).then((reservations) =>
      dispatch({
        type: "field",
        payload: { field: "reservations", value: reservations },
      })
    );
  }, [
    date,
    getManyBusTripsByDate,
    getManyBusTripReportsByDate,
    getManyBusReservationsByDate,
  ]);

  useEffect(() => {
    if (id)
      getBusTripById(id).then((trip) =>
        dispatch({
          type: "field",
          payload: { field: "selectedTrip", value: trip },
        })
      );
  }, [id, getBusTripById]);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <div className={styles.left}>
            <header className={styles.header}>
              <h1>Viagens</h1>
              <p>Gerencie as rotas diárias</p>
            </header>

            <DateInput
              value={date.toISOString().split("T")[0]}
              onChange={(e) => dispatch(parseDateInput(e.target.value))}
            />

            <ul className={styles.tripList}>
              {trips
                .filter((trip) => isSameDate(new Date(trip.date), date))
                .map((trip) => (
                  <li key={trip.id}>
                    <Card
                      className={`${styles.tripItem} ${
                        selectedTrip?.id === trip.id ? styles.selectedTrip : ""
                      }`}
                      onClick={() =>
                        dispatch({
                          type: "field",
                          payload: { field: "selectedTrip", value: trip },
                        })
                      }
                    >
                      <div className={styles.tripItemDate}>
                        <I.calendar size={18} color="var(--color-primary)" />
                        <h5>
                          {new Date(trip.date).toLocaleDateString("pt-BR")}
                        </h5>
                      </div>

                      <div className={styles.tripItemInfo}>
                        <span className={styles.badge}>
                          {trip.period === "morning" ? "Manhã" : "Tarde"}
                        </span>
                        <span className={styles.badge}>
                          {trip.direction === "go" ? "Ida" : "Volta"}
                        </span>
                      </div>
                    </Card>
                  </li>
                ))}
              {trips.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#94a3b8",
                    marginTop: "1rem",
                  }}
                >
                  Nenhuma viagem encontrada.
                </p>
              )}
            </ul>
          </div>
        }
        rightSide={
          <div className={styles.busTripArea}>
            {selectedTrip ? (
              <>
                <BusTripCard
                  selectedTrip={selectedTrip}
                  onStatusUpdated={(status) =>
                    dispatch({
                      type: "field",
                      payload: {
                        field: "selectedTrip",
                        value: { ...selectedTrip, status },
                      },
                    })
                  }
                />

                {/* Agrupamento visual das informações complementares */}
                <div className={styles.detailsGrid}>
                  {reservations.length > 0 && (
                    <BusReservationsCard
                      reservations={reservations.filter(
                        (res) => res.bus_trip_id === selectedTrip.id
                      )}
                    />
                  )}
                  {reports.length > 0 && (
                    <BusReportsCard
                      reports={reports.filter(
                        (rep) => rep.bus_trip_id === selectedTrip.id
                      )}
                    />
                  )}
                </div>
              </>
            ) : (
              <Card className={styles.nonSelectedTripBox}>
                <I.calendar size={48} />
                <h1 style={{ marginTop: "1rem" }}>Selecione uma viagem</h1>
                <p>
                  Escolha uma rota na lista à esquerda para gerenciar reservas e
                  relatórios.
                </p>
              </Card>
            )}
          </div>
        }
        leftClassName={styles.left}
        rightClassName={styles.right}
      />
    </Private>
  );
}
