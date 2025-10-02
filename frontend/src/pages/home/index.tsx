import { useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

import {
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
import { C, Card, I, Navbar, Private } from "../../components";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

import styles from "./styles.module.css";

interface State {
  busTrips: BusTrip[];
  busTripReports: BusTripReport[];
  busReservations: BusReservation[];
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
  busTrips: [],
  busTripReports: [],
  busReservations: [],
};

export function DashboardPage() {
  const navigate = useNavigate();

  const { getManyBusTripsByDate } = useManyBusTripsByDate();
  const { getManyBusTripReportsByDate } = useManyBusTripReportsByDate();
  const { getManyBusReservationsByDate } = useManyBusReservationsByDate();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { busTrips, busTripReports, busReservations } = state;

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    getManyBusTripsByDate(today).then((trips) =>
      dispatch({ type: "field", payload: { field: "busTrips", value: trips } })
    );
    getManyBusTripReportsByDate(today).then((reports) =>
      dispatch({
        type: "field",
        payload: { field: "busTripReports", value: reports },
      })
    );
    getManyBusReservationsByDate(today).then((reservations) =>
      dispatch({
        type: "field",
        payload: { field: "busReservations", value: reservations },
      })
    );
  }, [
    getManyBusTripsByDate,
    getManyBusTripReportsByDate,
    getManyBusReservationsByDate,
  ]);

  return (
    <Private>
      <Navbar />
      <div className={styles.container}>
        <h1>Análise diária</h1>
        {busTrips.length === 0 ? (
          <Card className={styles.noTrips}>
            <h2>Nenhuma viagem encontrada</h2>
            <p>Este dia não possui nenhuma viagem agendada.</p>
          </Card>
        ) : (
          <ul className={styles.tripList}>
            {busTrips.map((busTrip) => {
              const reportsForTrip = busTripReports.filter(
                (report) => report.bus_trip_id === busTrip.id
              );

              const reservationsForTrip = busReservations.filter(
                (reservation) => reservation.bus_trip_id === busTrip.id
              );

              const marcouEFoi = reportsForTrip.filter(
                (r) => r.marked && r.attended
              ).length;
              const marcouENaoFoi = reportsForTrip.filter(
                (r) => r.marked && !r.attended
              ).length;
              const naoMarcouEFoi = reportsForTrip.filter(
                (r) => !r.marked && r.attended
              ).length;

              return (
                <li key={busTrip.id}>
                  <Card
                    className={styles.tripCard}
                    onClick={() => navigate(`/viagens/${busTrip.id}`)}
                  >
                    <div className={styles.tripGraph}>
                      {reportsForTrip.length > 0 ? (
                        <C.pizza
                          data={{
                            labels: [
                              "Marcou e foi",
                              "Marcou e não foi",
                              "Não marcou e foi",
                            ],
                            datasets: [
                              {
                                label: "Passageiros",
                                data: [
                                  marcouEFoi,
                                  marcouENaoFoi,
                                  naoMarcouEFoi,
                                ],
                                backgroundColor: ["blue", "yellow", "red"],
                              },
                            ],
                          }}
                          labelDisplay={false}
                        />
                      ) : (
                        <C.pizza
                          data={{
                            labels: ["Reservas"],
                            datasets: [
                              {
                                label: "Quantidade",
                                data: [reservationsForTrip.length || 100],
                                backgroundColor: ["gray"],
                              },
                            ],
                          }}
                          labelDisplay={false}
                        />
                      )}
                    </div>
                    <div className={styles.tripInfo}>
                      <h2>{busTrip.direction === "go" ? "Ida" : "Volta"}</h2>
                      <hr />
                      <small>
                        {busTrip.period === "morning" ? "Manhã" : "Tarde"}
                      </small>
                      <small>
                        <I.calendar />{" "}
                        {new Date(busTrip.date).toLocaleDateString()}
                      </small>
                      <small>
                        Status:{" "}
                        {busTrip.status === "unstarted"
                          ? "Não iniciado"
                          : busTrip.status === "started"
                          ? "Iniciado"
                          : "Terminado"}
                      </small>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Private>
  );
}
