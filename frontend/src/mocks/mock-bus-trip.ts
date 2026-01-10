import type { BusTrip, Direction, Period, Status } from "../types";

// 1. Viagem de Ida - Manhã (Não Iniciada)
export const mockBusTripIdaManha: BusTrip = {
  id: "trip-001",
  date: new Date(),
  period: "morning" as Period,
  direction: "go" as Direction,
  status: "unstarted" as Status,
  created_at: new Date(),
  updated_at: new Date(),
};

// 2. Viagem de Volta - Manhã (Em Andamento)
export const mockBusTripVoltaManha: BusTrip = {
  id: "trip-002",
  date: new Date(),
  period: "morning" as Period,
  direction: "return" as Direction,
  status: "started" as Status,
  created_at: new Date(),
  updated_at: new Date(),
};

// 3. Viagem de Ida - Tarde (Finalizada)
export const mockBusTripIdaTarde: BusTrip = {
  id: "trip-003",
  date: new Date(),
  period: "afternoon" as Period,
  direction: "go" as Direction,
  status: "finished" as Status,
  created_at: new Date(),
  updated_at: new Date(),
};

// 4. Viagem de Volta - Tarde (Não Iniciada)
export const mockBusTripVoltaTarde: BusTrip = {
  id: "trip-004",
  date: new Date(),
  period: "afternoon" as Period,
  direction: "return" as Direction,
  status: "unstarted" as Status,
  created_at: new Date(),
  updated_at: new Date(),
};

// Lista para exportação conjunta
export const mockBusTripsList = [
  mockBusTripIdaManha,
  mockBusTripVoltaManha,
  mockBusTripIdaTarde,
  mockBusTripVoltaTarde,
];
