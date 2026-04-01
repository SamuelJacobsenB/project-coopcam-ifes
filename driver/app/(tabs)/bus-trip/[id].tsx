import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BusTripCard, Line, LoadPage, QrCodeReader } from "@/components";
import { useMessage } from "@/contexts";
import { useBusTripById, useManyBusReservationsByTripId } from "@/hooks";
import { colors } from "@/styles";
import { BusReservation, BusTrip, ScannedUser } from "@/types";
import {
  getReservationsByTripId,
  getScannedUsersByTripId,
  getBusTripById as getStoredBusTrip,
  setReservationsByTripId,
  setScannedUsersByTripId,
} from "@/utils";

export default function BusTripPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showMessage } = useMessage();

  // Hooks da API
  const { getBusTripById: fetchBusTripApi } = useBusTripById();
  const { getManyBusReservationsByTripId: fetchReservationsApi } =
    useManyBusReservationsByTripId();

  const [busTrip, setBusTrip] = useState<BusTrip | null>(null);
  const [reservations, setReservations] = useState<BusReservation[]>([]);
  const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      // 1. Tenta carregar tudo o que estiver no Storage Local primeiro (Offline First)
      const [storedTrip, storedScanned, storedReservations] = await Promise.all(
        [
          getStoredBusTrip(id),
          getScannedUsersByTripId(id),
          getReservationsByTripId(id),
        ],
      );

      if (storedTrip) setBusTrip(storedTrip);
      setScannedUsers(storedScanned);
      setReservations(storedReservations);

      // 2. Busca dados atualizados da API e sincroniza o Cache
      try {
        const [freshTrip, freshReservations] = await Promise.all([
          fetchBusTripApi(id),
          fetchReservationsApi(id),
        ]);

        if (freshTrip) setBusTrip(freshTrip);

        if (freshReservations) {
          setReservations(freshReservations);
          await setReservationsByTripId(id, freshReservations);
        }
      } catch {
        console.log("Modo Offline: Não foi possível atualizar dados da API.");
      }
    } catch {
      showMessage("Erro ao carregar dados", "error");
    } finally {
      setLoading(false);
    }
  }, [id, fetchBusTripApi, fetchReservationsApi, showMessage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScan = useCallback(
    async (data: string) => {
      if (!id) return;

      try {
        const parts = data.split(":");
        const userId = parts[0];
        const userName = parts.slice(1).join(":").replaceAll("-", " ");

        if (scannedUsers.some((u) => u.userId === userId)) {
          return showMessage(`${userName} já realizou o check-in!`, "error");
        }

        const hasReservation = reservations.some(
          (res) => res.user_id === userId,
        );

        const newUser: ScannedUser = {
          userId,
          userName,
        };
        const updatedScanned = [...scannedUsers, newUser];

        // Atualiza estado e storage usando a nova função set
        setScannedUsers(updatedScanned);
        await setScannedUsersByTripId(id, updatedScanned);

        if (hasReservation) {
          showMessage(`${userName} confirmado na lista`, "success");
        } else {
          showMessage(`${userName} não está na lista oficial!`, "error");
        }
      } catch {
        showMessage("QR Code inválido.", "error");
      }
    },
    [id, scannedUsers, reservations, showMessage],
  );

  if (loading || !busTrip) return <LoadPage />;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BusTripCard trip={busTrip} />

        <QrCodeReader onScan={handleScan} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Relatório de Embarque ({scannedUsers.length})
          </Text>
          <Line />

          {scannedUsers.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum embarque registrado.</Text>
          ) : (
            scannedUsers.map((user, index) => {
              const isOnList = reservations.some(
                (res) => res.user_id === user.userId,
              );

              return (
                <View key={index} style={styles.userItem}>
                  <Ionicons
                    name={isOnList ? "checkmark-circle" : "warning"}
                    size={20}
                    color={isOnList ? colors.primary : "#EAB308"}
                  />
                  <View>
                    <Text style={styles.userText}>{user.userName}</Text>
                    {!isOnList && (
                      <Text style={styles.warningSubtext}>
                        Não estava na lista
                      </Text>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  backButton: { margin: 16 },
  scrollContent: { padding: 20, gap: 20 },
  section: { backgroundColor: "#fff", padding: 16, borderRadius: 12, gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800" },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
  },
  userText: { fontSize: 16, color: "#334155" },
  warningSubtext: { fontSize: 12, color: "#EAB308", fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#94a3b8", fontStyle: "italic" },
});
