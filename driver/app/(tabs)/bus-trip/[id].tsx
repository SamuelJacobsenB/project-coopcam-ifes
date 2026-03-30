import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BusTripCard, Line, LoadPage, QrCodeReader } from "@/components";
import { useMessage } from "@/contexts";
import { useBusTripById, useManyBusReservationsByTripId } from "@/hooks";
import { colors } from "@/styles";
import { BusTrip, ScannedUser } from "@/types";

const STORAGE_KEYS = {
  SCANNED: (id: string) => `@scanned_users_${id}`,
  RESERVATIONS: (id: string) => `@reservations_trip_${id}`,
};

export default function BusTripPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showMessage } = useMessage();

  const { getBusTripById } = useBusTripById();
  const { getManyBusReservationsByTripId } = useManyBusReservationsByTripId();

  const [busTrip, setBusTrip] = useState<BusTrip | null>(null);
  const [reservations, setReservations] = useState<any[]>([]);
  const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      // Tenta carregar dados básicos e o que já foi escaneado localmente
      const [trip, storedScanned, storedReservations] = await Promise.all([
        getBusTripById(id),
        AsyncStorage.getItem(STORAGE_KEYS.SCANNED(id)),
        AsyncStorage.getItem(STORAGE_KEYS.RESERVATIONS(id)),
      ]);

      if (trip) setBusTrip(trip);
      if (storedScanned) setScannedUsers(JSON.parse(storedScanned));
      if (storedReservations) setReservations(JSON.parse(storedReservations));

      // Tenta atualizar a lista de reservas pela API (Online)
      try {
        const freshReservations = await getManyBusReservationsByTripId(id);
        if (freshReservations) {
          setReservations(freshReservations);
          await AsyncStorage.setItem(
            STORAGE_KEYS.RESERVATIONS(id),
            JSON.stringify(freshReservations),
          );
        }
      } catch {
        console.log("Offline: Usando lista de reservas cacheada.");
      }
    } catch {
      showMessage("Erro ao sincronizar dados", "error");
    } finally {
      setLoading(false);
    }
  }, [id, getBusTripById, getManyBusReservationsByTripId, showMessage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScan = useCallback(
    async (data: string) => {
      try {
        const parts = data.split(":");
        const userId = parts[0];
        const userName = parts.slice(1).join(":").replaceAll("-", " ");

        if (scannedUsers.some((u) => u.userId === userId)) {
          return showMessage(`${userName} já realizou o check-in!`, "error");
        }

        const hasReservation = reservations.some(
          (res) => res.user.id === userId,
        );

        const newUser = { userId, userName, onList: hasReservation };

        setScannedUsers((prev) => {
          const updated = [...prev, newUser];
          AsyncStorage.setItem(
            STORAGE_KEYS.SCANNED(id!),
            JSON.stringify(updated),
          );
          return updated;
        });

        // Mensagem personalizada baseada na reserva
        if (hasReservation) {
          showMessage(`${userName} confirmado na lista`, "success");
        } else {
          showMessage(`${userName} não confirmado na lista!`, "error");
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

        <View style={styles.cameraContainer}>
          <QrCodeReader onScan={handleScan} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Relatório de Embarque ({scannedUsers.length})
          </Text>
          <Line />
          {scannedUsers.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum embarque registrado.</Text>
          ) : (
            scannedUsers.map((user, index) => {
              const onList = reservations.some(
                (res) => res.user.id === user.userId,
              );

              return (
                <View key={index} style={styles.userItem}>
                  <Ionicons
                    name={
                      reservations.some((res) => res.user.id === user.userId)
                        ? "checkmark-circle"
                        : "warning"
                    }
                    size={20}
                    color={onList ? colors.primary : "#EAB308"}
                  />
                  <View>
                    <Text style={styles.userText}>{user.userName}</Text>
                    {onList && (
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
  cameraContainer: {
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#000",
  },
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
