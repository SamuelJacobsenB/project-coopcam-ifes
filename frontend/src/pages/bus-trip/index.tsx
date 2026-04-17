import { useCallback, useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";

import { DateInput, DualPage, I, Navbar, Private } from "../../components";
import {
  useBusTripById,
  useManyBusReservationsByDate,
  useManyBusTripReportsByDate,
  useManyBusTripsByDate,
} from "../../hooks";
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

interface BusTripState {
  date: Date;
  trips: BusTrip[];
  reservations: BusReservation[];
  reports: BusTripReport[];
  selectedTrip: BusTrip | null;
  isLoading: boolean;
}

type BusTripAction =
  | {
      type: "SET_FIELD";
      payload: { field: keyof BusTripState; value: unknown };
    }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_DATA"; payload: Partial<BusTripState> };

function busTripReducer(
  state: BusTripState,
  action: BusTripAction,
): BusTripState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.payload.field]: action.payload.value };
    case "SET_DATA":
      return { ...state, ...action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

export function BusTripPage() {
  const { id } = useParams<{ id: string }>();

  const { getBusTripById } = useBusTripById();
  const { getManyBusTripsByDate } = useManyBusTripsByDate();
  const { getManyBusReservationsByDate } = useManyBusReservationsByDate();
  const { getManyBusTripReportsByDate } = useManyBusTripReportsByDate();

  const [state, dispatch] = useReducer(busTripReducer, {
    date: new Date(),
    trips: [],
    reservations: [],
    reports: [],
    selectedTrip: null,
    isLoading: false,
  });

  const { date, trips, selectedTrip, reservations, reports, isLoading } = state;

  const tripReservations = useMemo(
    () => reservations.filter((r) => r.bus_trip_id === selectedTrip?.id),
    [reservations, selectedTrip?.id],
  );

  const tripReports = useMemo(
    () => reports.filter((r) => r.bus_trip_id === selectedTrip?.id),
    [reports, selectedTrip?.id],
  );

  const fetchData = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const strDate = formatDateForInput(date);
      const [fetchedTrips, fetchedReports, fetchedReservations] =
        await Promise.all([
          getManyBusTripsByDate(strDate),
          getManyBusTripReportsByDate(strDate),
          getManyBusReservationsByDate(strDate),
        ]);

      dispatch({
        type: "SET_DATA",
        payload: {
          trips: fetchedTrips,
          reports: fetchedReports,
          reservations: fetchedReservations,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [
    date,
    getManyBusTripsByDate,
    getManyBusTripReportsByDate,
    getManyBusReservationsByDate,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (id) {
      getBusTripById(id).then((trip) =>
        dispatch({
          type: "SET_FIELD",
          payload: { field: "selectedTrip", value: trip },
        }),
      );
    } else if (trips.length > 0 && !selectedTrip) {
      dispatch({
        type: "SET_FIELD",
        payload: { field: "selectedTrip", value: trips[0] },
      });
    }
  }, [id, trips, getBusTripById, selectedTrip]);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <aside className={styles.left}>
            <header className={styles.header}>
              <div className={styles.headerText}>
                <h1>Viagens</h1>
                <p>Gerencie as rotas diárias</p>
              </div>
              {isLoading && (
                <span role="status" className={styles.loadingBadge}>
                  Carregando...
                </span>
              )}
            </header>

            <nav aria-label="Seleção de data">
              <DateInput
                value={formatDateForInput(date)}
                onChange={(e) =>
                  dispatch({
                    type: "SET_FIELD",
                    payload: {
                      field: "date",
                      value: parseInputDate(e.target.value),
                    },
                  })
                }
              />
            </nav>

            <ul className={styles.tripList} aria-label="Lista de viagens">
              {trips.map((trip) => (
                <BusTripCard
                  key={trip.id}
                  isSelected={selectedTrip?.id === trip.id}
                  trip={trip}
                  onSelectTrip={(t) =>
                    dispatch({
                      type: "SET_FIELD",
                      payload: { field: "selectedTrip", value: t },
                    })
                  }
                />
              ))}
              {!isLoading && trips.length === 0 && (
                <li className={styles.emptyMsg}>Nenhuma viagem nesta data.</li>
              )}
            </ul>
          </aside>
        }
        rightSide={
          <main className={styles.busTripArea}>
            {selectedTrip ? (
              <article>
                <SelectedBusTripCard
                  selectedTrip={selectedTrip}
                  reservationsLength={tripReservations.length}
                  reports={tripReports}
                  onStatusUpdated={(status) =>
                    dispatch({
                      type: "SET_FIELD",
                      payload: {
                        field: "selectedTrip",
                        value: { ...selectedTrip, status },
                      },
                    })
                  }
                />

                <div className={styles.detailsGrid}>
                  <section
                    className={styles.gridColumn}
                    aria-labelledby="res-title"
                  >
                    <h3 id="res-title">Reservas ({tripReservations.length})</h3>
                    <BusReservationsCard reservations={tripReservations} />
                  </section>
                  <section
                    className={styles.gridColumn}
                    aria-labelledby="rep-title"
                  >
                    <h3 id="rep-title">Relatórios ({tripReports.length})</h3>
                    <BusReportsCard reports={tripReports} />
                  </section>
                </div>
              </article>
            ) : (
              <EmptyState />
            )}
          </main>
        }
      />
    </Private>
  );
}

const EmptyState = () => (
  <div className={styles.rightPlaceholder} role="region" aria-live="polite">
    <I.map size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
    <h2>Selecione uma viagem</h2>
    <p>Clique numa viagem na lista à esquerda para ver os detalhes.</p>
  </div>
);
