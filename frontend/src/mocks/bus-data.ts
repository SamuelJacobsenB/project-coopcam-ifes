import type { BusReservation, BusTrip, BusTripReport } from "../types";

const today = new Date();

export const MOCK_TRIPS: BusTrip[] = [
  {
    id: "morning-go",
    date: today,
    period: "morning",
    direction: "go",
    status: "finished",
    created_at: today,
    updated_at: today,
  },
  {
    id: "morning-return",
    date: today,
    period: "morning",
    direction: "return",
    status: "started",
    created_at: today,
    updated_at: today,
  },
  {
    id: "afternoon-go",
    date: today,
    period: "afternoon",
    direction: "go",
    status: "unstarted",
    created_at: today,
    updated_at: today,
  },
  {
    id: "afternoon-return",
    date: today,
    period: "afternoon",
    direction: "return",
    status: "unstarted",
    created_at: today,
    updated_at: today,
  },
];

export const MOCK_REPORTS: BusTripReport[] = [
  // Relatórios da Ida Manhã (Finalizada)
  {
    id: "r1",
    bus_trip_id: "morning-go",
    user_id: "u1",
    user_name: "João Silva",
    marked: true,
    attended: true,
    date: today,
    period: "morning",
    direction: "go",
    user: null,
    bus_trip: null,
    created_at: today,
    updated_at: today,
  },
  {
    id: "r2",
    bus_trip_id: "morning-go",
    user_id: "u2",
    user_name: "Maria Luz",
    marked: true,
    attended: false,
    date: today,
    period: "morning",
    direction: "go",
    user: null,
    bus_trip: null,
    created_at: today,
    updated_at: today,
  },

  // Relatórios da Volta Manhã (Em andamento)
  {
    id: "r3",
    bus_trip_id: "morning-return",
    user_id: "u1",
    user_name: "João Silva",
    marked: true,
    attended: true,
    date: today,
    period: "morning",
    direction: "return",
    user: null,
    bus_trip: null,
    created_at: today,
    updated_at: today,
  },
];

export const MOCK_RESERVATIONS: BusReservation[] = [
  // Reservas para a Tarde
  {
    id: "res1",
    bus_trip_id: "afternoon-go",
    user_id: "u3",
    user_name: "Carlos Teste",
    date: today,
    period: "afternoon",
    created_at: today,
    updated_at: today,
  },
  {
    id: "res2",
    bus_trip_id: "afternoon-return",
    user_id: "u3",
    user_name: "Carlos Teste",
    date: today,
    period: "afternoon",
    created_at: today,
    updated_at: today,
  },
];
