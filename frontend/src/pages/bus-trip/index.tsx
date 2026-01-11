import { useEffect, useReducer, useCallback } from "react";
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
import { isSameDate } from "../../utils";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

import { BusReportsCard, BusReservationsCard, BusTripCard } from "./components";

import styles from "./styles.module.css";

interface State {
  date: Date;
  trips: BusTrip[];
  reservations: BusReservation[];
  reports: BusTripReport[];
  selectedTrip: BusTrip | null;
  isLoading: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const reducer = (state: State, action: any) => {
  switch (action.type) {
    case "field":
      return {
        ...state,
        [action.payload.field as string]: action.payload.value,
      };
    case "set_loading":
      return { ...state, isLoading: action.payload };
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
  isLoading: false,
};

export function BusTripPage() {
  const { id } = useParams();

  const { getBusTripById } = useBusTripById();
  const { getManyBusTripsByDate } = useManyBusTripsByDate();
  const { getManyBusReservationsByDate } = useManyBusReservationsByDate();
  const { getManyBusTripReportsByDate } = useManyBusTripReportsByDate();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { date, trips, selectedTrip, reservations, reports, isLoading } = state;

  // Função para formatar data localmente YYYY-MM-DD
  const formatDateToInputValue = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (dateString: string) => {
    if (!dateString) return;
    // Cria a data baseada nos componentes para evitar problemas de timezone (UTC vs Local)
    const [y, m, d] = dateString.split("-").map(Number);
    const newDate = new Date(y, m - 1, d);
    dispatch({ type: "field", payload: { field: "date", value: newDate } });
  };

  const fetchData = useCallback(async () => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const strDate = formatDateToInputValue(date);

      // Executa todas as requisições em paralelo
      const [fetchedTrips, fetchedReports, fetchedReservations] =
        await Promise.all([
          getManyBusTripsByDate(strDate),
          getManyBusTripReportsByDate(strDate),
          getManyBusReservationsByDate(strDate),
        ]);

      dispatch({
        type: "field",
        payload: { field: "trips", value: fetchedTrips },
      });
      dispatch({
        type: "field",
        payload: { field: "reports", value: fetchedReports },
      });
      dispatch({
        type: "field",
        payload: { field: "reservations", value: fetchedReservations },
      });
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  }, [
    date,
    getManyBusTripsByDate,
    getManyBusTripReportsByDate,
    getManyBusReservationsByDate,
  ]);

  // Effect para carregar dados quando a data mudar
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Effect para carregar viagem específica via URL (apenas na montagem ou troca de ID)
  useEffect(() => {
    if (id) {
      getBusTripById(id).then((trip) =>
        dispatch({
          type: "field",
          payload: { field: "selectedTrip", value: trip },
        })
      );
    }
  }, [id, getBusTripById]);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <div className={styles.left}>
            <header className={styles.header}>
              <div>
                <h1>Viagens</h1>
                <p>Gerencie as rotas diárias</p>
              </div>
              {isLoading && (
                <span className={styles.loadingBadge}>Carregando...</span>
              )}
            </header>

            <div className={styles.controls}>
              <DateInput
                value={formatDateToInputValue(date)}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

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
                      <div className={styles.tripItemMain}>
                        <div className={styles.tripItemDate}>
                          {/* Ícone muda conforme o período */}
                          {trip.period === "morning" ? (
                            <I.sun size={18} color="#eab308" />
                          ) : (
                            <I.moon size={18} color="#6366f1" />
                          )}
                          <h5>
                            {new Date(trip.date).toLocaleDateString("pt-BR", {
                              timeZone: "UTC",
                            })}
                          </h5>
                        </div>
                        <span className={styles.routeText}>
                          {trip.direction === "go"
                            ? "Ida ao Campus"
                            : "Retorno"}
                        </span>
                      </div>

                      <div className={styles.tripItemInfo}>
                        <span
                          className={`${styles.badge} ${
                            trip.direction === "go"
                              ? styles.badgeGo
                              : styles.badgeBack
                          }`}
                        >
                          {trip.direction === "go" ? (
                            <I.arrow_forward size={12} />
                          ) : (
                            <I.arrow_back size={12} />
                          )}
                          {trip.direction === "go" ? "Ida" : "Volta"}
                        </span>
                      </div>
                    </Card>
                  </li>
                ))}
              {!isLoading && trips.length === 0 && (
                <div className={styles.emptyState}>
                  <I.calendar size={32} color="#cbd5e1" />
                  <p>Nenhuma viagem encontrada para esta data.</p>
                </div>
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

                <div className={styles.detailsGrid}>
                  <div className={styles.gridColumn}>
                    <h3>
                      Reservas (
                      {
                        reservations.filter(
                          (r) => r.bus_trip_id === selectedTrip.id
                        ).length
                      }
                      )
                    </h3>
                    {reservations.length > 0 ? (
                      <BusReservationsCard
                        reservations={reservations.filter(
                          (res) => res.bus_trip_id === selectedTrip.id
                        )}
                      />
                    ) : (
                      <p className={styles.emptySubText}>Sem reservas.</p>
                    )}
                  </div>

                  <div className={styles.gridColumn}>
                    <h3>Relatórios</h3>
                    {reports.length > 0 ? (
                      <BusReportsCard
                        reports={reports.filter(
                          (rep) => rep.bus_trip_id === selectedTrip.id
                        )}
                      />
                    ) : (
                      <p className={styles.emptySubText}>Nenhum relatório.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <Card className={styles.nonSelectedTripBox}>
                <I.map size={48} color="#cbd5e1" />
                <h1 style={{ marginTop: "1rem", color: "#475569" }}>
                  Selecione uma viagem
                </h1>
                <p>
                  Clique em um card à esquerda para ver os detalhes, passageiros
                  e relatórios.
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
