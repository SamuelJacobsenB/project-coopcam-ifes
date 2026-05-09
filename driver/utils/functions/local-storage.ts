import AsyncStorage from "@react-native-async-storage/async-storage";

import { BusReservation, BusTrip, ScannedUser } from "@/types";
import { STORAGE_KEYS } from "../constants";

// Funções get
async function getScannedUsersByTripId(id: string) {
  try {
    const storedScanned = await AsyncStorage.getItem(STORAGE_KEYS.SCANNED(id));
    return storedScanned ? (JSON.parse(storedScanned) as ScannedUser[]) : [];
  } catch {
    console.error("Erro ao acessar usuários escaneados");
    return [];
  }
}

async function getReservationsByTripId(id: string) {
  try {
    const storedReservations = await AsyncStorage.getItem(
      STORAGE_KEYS.RESERVATIONS(id),
    );
    return storedReservations
      ? (JSON.parse(storedReservations) as BusReservation[])
      : [];
  } catch {
    console.error("Erro ao acessar reservas");
    return [];
  }
}

async function getBusTripById(id: string) {
  try {
    const storedBusTrip = await AsyncStorage.getItem(STORAGE_KEYS.BUS_TRIP(id));
    return storedBusTrip ? (JSON.parse(storedBusTrip) as BusTrip) : null;
  } catch {
    console.error("Erro ao acessar viagem");
    return null;
  }
}

async function getBusTripsByDate(date: string) {
  try {
    const storedBusTrips = await AsyncStorage.getItem(
      STORAGE_KEYS.BUS_TRIPS_BY_DATE(date),
    );
    return storedBusTrips ? (JSON.parse(storedBusTrips) as BusTrip[]) : [];
  } catch {
    console.error("Erro ao acessar viagens");
    return [];
  }
}

export {
  getBusTripById,
  getBusTripsByDate,
  getReservationsByTripId,
  getScannedUsersByTripId,
};

// Funções set
async function setScannedUsersByTripId(id: string, users: ScannedUser[]) {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.SCANNED(id), JSON.stringify(users));
  } catch {
    console.error("Erro ao salvar usuários escaneados");
  }
}

async function setReservationsByTripId(
  id: string,
  reservations: BusReservation[],
) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.RESERVATIONS(id),
      JSON.stringify(reservations),
    );
  } catch {
    console.error("Erro ao salvar reservas");
  }
}

async function setBusTripById(id: string, busTrip: BusTrip) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.BUS_TRIP(id),
      JSON.stringify(busTrip),
    );
  } catch {
    console.error("Erro ao salvar viagem");
  }
}

async function setBusTripsByDate(date: string, busTrips: BusTrip[]) {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.BUS_TRIPS_BY_DATE(date),
      JSON.stringify(busTrips),
    );
  } catch {
    console.error("Erro ao salvar viagens");
  }
}

export {
  setBusTripById,
  setBusTripsByDate,
  setReservationsByTripId,
  setScannedUsersByTripId,
};
