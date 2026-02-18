import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";

import { DateInput, DualPage, I, Navbar, Private } from "../../components";
import {
  MOCK_REPORTS,
  MOCK_RESERVATIONS,
  MOCK_TRIPS,
} from "../../mocks/bus-management-data";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

import {
  BusReportsCard,
  BusReservationsCard,
  BusTripCard,
  SelectedBusTripCard,
} from "./components";

import styles from "./styles.module.css";

const formatDateForInput = (d: Date) => d.toISOString().split("T")[0];

const parseInputDate = (dateString: string) => {
  const [y, m, d] = dateString.split("-").map(Number);
  return new Date(y, m - 1, d);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (state: any, action: any) => {
  switch (action.type) {
    case "field":
      return { ...state, [action.payload.field]: action.payload.value };
    case "set_loading":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export function DevelopmentPage() {
  const { id } = useParams();
  const [state, dispatch] = useReducer(reducer, {
    date: new Date(),
    trips: [],
    reservations: [],
    reports: [],
    selectedTrip: null,
    isLoading: false,
  });

  const { date, trips, selectedTrip, reservations, reports, isLoading } = state;

  const tripReservations = useMemo(
    () =>
      reservations.filter(
        (r: BusReservation) => r.bus_trip_id === selectedTrip?.id,
      ),
    [reservations, selectedTrip],
  );

  const tripReports = useMemo(
    () =>
      reports.filter((r: BusTripReport) => r.bus_trip_id === selectedTrip?.id),
    [reports, selectedTrip],
  );

  const fetchData = useCallback(async () => {
    dispatch({ type: "set_loading", payload: true });
    await new Promise((r) => setTimeout(r, 500));
    dispatch({ type: "field", payload: { field: "trips", value: MOCK_TRIPS } });
    dispatch({
      type: "field",
      payload: { field: "reports", value: MOCK_REPORTS },
    });
    dispatch({
      type: "field",
      payload: { field: "reservations", value: MOCK_RESERVATIONS },
    });
    dispatch({ type: "set_loading", payload: false });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (trips.length > 0) {
      const trip = id ? trips.find((t: BusTrip) => t.id === id) : trips[0];
      if (trip)
        dispatch({
          type: "field",
          payload: { field: "selectedTrip", value: trip },
        });
    }
  }, [id, trips]);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <div className={styles.left}>
            <header className={styles.header}>
              <h1>Viagens</h1>
              {isLoading && (
                <span className={styles.loadingBadge}>Carregando...</span>
              )}
            </header>

            <DateInput
              value={formatDateForInput(date)}
              onChange={(e) =>
                dispatch({
                  type: "field",
                  payload: {
                    field: "date",
                    value: parseInputDate(e.target.value),
                  },
                })
              }
            />

            <ul className={styles.tripList}>
              {trips.map((trip: BusTrip) => (
                <BusTripCard
                  key={trip.id}
                  isSelected={selectedTrip?.id === trip.id}
                  trip={trip}
                  onSelectTrip={(t) =>
                    dispatch({
                      type: "field",
                      payload: { field: "selectedTrip", value: t },
                    })
                  }
                />
              ))}
            </ul>
          </div>
        }
        rightSide={
          selectedTrip ? (
            <div className={styles.busTripArea}>
              <SelectedBusTripCard
                selectedTrip={selectedTrip}
                reservationsLength={tripReservations.length}
                reports={tripReports}
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

              <div className={styles.detailsGrid}>
                <section className={styles.gridColumn}>
                  <h3>Reservas ({tripReservations.length})</h3>
                  <BusReservationsCard reservations={tripReservations} />
                </section>
                <section className={styles.gridColumn}>
                  <h3>Relatórios ({tripReports.length})</h3>
                  <BusReportsCard reports={tripReports} />
                </section>
              </div>
            </div>
          ) : (
            <EmptyState />
          )
        }
      />
    </Private>
  );
}

const EmptyState = () => (
  <div className={styles.rightPlaceholder}>
    <I.map size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
    <h2>Selecione uma viagem</h2>
    <p>Clique numa viagem na lista à esquerda para ver os detalhes.</p>
  </div>
);
