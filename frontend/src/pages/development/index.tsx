import { useCallback, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";

import { DateInput, DualPage, I, Navbar, Private } from "../../components";
import type { BusReservation, BusTrip, BusTripReport } from "../../types";

// Importação dos seus dados Mock
import {
  MOCK_REPORTS,
  MOCK_RESERVATIONS,
  MOCK_TRIPS,
} from "../../mocks/bus-management-data";

import {
  BusReportsCard,
  BusReservationsCard,
  BusTripCard,
  SelectedBusTripCard,
} from "./components";

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

export function DevelopmentPage() {
  const { id } = useParams();

  const [state, dispatch] = useReducer(reducer, initialState);
  const { date, trips, selectedTrip, reservations, reports, isLoading } = state;

  const formatDateToInputValue = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (dateString: string) => {
    if (!dateString) return;
    const [y, m, d] = dateString.split("-").map(Number);
    const newDate = new Date(y, m - 1, d);
    dispatch({ type: "field", payload: { field: "date", value: newDate } });
  };

  // Função fetchData adaptada para usar os Mocks
  const fetchData = useCallback(async () => {
    dispatch({ type: "set_loading", payload: true });
    try {
      // Simula um pequeno delay de rede para testar o loading
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Inserção dos dados provenientes do bus-management-data.ts
      dispatch({
        type: "field",
        payload: { field: "trips", value: MOCK_TRIPS },
      });
      dispatch({
        type: "field",
        payload: { field: "reports", value: MOCK_REPORTS },
      });
      dispatch({
        type: "field",
        payload: { field: "reservations", value: MOCK_RESERVATIONS },
      });
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    } finally {
      dispatch({ type: "set_loading", payload: false });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Lógica de seleção: ID da URL ou primeira viagem da lista
  useEffect(() => {
    if (trips.length > 0) {
      const trip = id ? trips.find((t) => t.id === id) : trips[0];
      if (trip) {
        dispatch({
          type: "field",
          payload: { field: "selectedTrip", value: trip },
        });
      }
    }
  }, [id, trips]);

  return (
    <Private>
      <Navbar />
      <DualPage
        leftSide={
          <div className={styles.left}>
            <header className={styles.header}>
              <div>
                <h1>Viagens</h1>
                <p>Gerencie as rotas diárias (Modo Mock)</p>
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
              {trips.map((trip) => (
                <li key={trip.id}>
                  <BusTripCard
                    isSelected={selectedTrip?.id === trip.id}
                    trip={trip}
                    onSelectTrip={(trip) =>
                      dispatch({
                        type: "field",
                        payload: { field: "selectedTrip", value: trip },
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        }
        rightSide={
          selectedTrip ? (
            <div className={styles.busTripArea}>
              <SelectedBusTripCard
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
                        (r) => r.bus_trip_id === selectedTrip.id,
                      ).length
                    }
                    )
                  </h3>
                  <BusReservationsCard
                    reservations={reservations.filter(
                      (res) => res.bus_trip_id === selectedTrip.id,
                    )}
                  />
                </div>
                <div className={styles.gridColumn}>
                  <h3>
                    Relatórios (
                    {
                      reports.filter(
                        (rep) => rep.bus_trip_id === selectedTrip.id,
                      ).length
                    }
                    )
                  </h3>
                  <BusReportsCard
                    reports={reports.filter(
                      (rep) => rep.bus_trip_id === selectedTrip.id,
                    )}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.rightPlaceholder}>
              <I.map size={48} color="#ccc" style={{ marginBottom: "1rem" }} />
              <h2>Selecione uma viagem</h2>
              <p>
                Clique numa viagem na lista à esquerda para ver os detalhes.
              </p>
            </div>
          )
        }
      />
    </Private>
  );
}
