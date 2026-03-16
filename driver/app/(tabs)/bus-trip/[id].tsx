import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import { BusTripCard, Line, LoadPage, QrCodeReader } from "@/components";
import { useMessage } from "@/contexts";
import { useBusTripById } from "@/hooks";
import { colors } from "@/styles";
import { BusTrip, ScannedUser } from "@/types";

const STORAGE_KEYS = {
  SCANNED: (id: string) => `@scanned_users_${id}`,
  TRIP_DATE: (id: string) => `@trip_date_${id}`,
};

export default function BusTripPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripId = id || "";

  const { showMessage } = useMessage();
  const { getBusTripById } = useBusTripById();

  const [busTrip, setBusTrip] = useState<BusTrip | null>(null);
  const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);

  const loadData = useCallback(async () => {
    if (!tripId) return;

    try {
      const [trip, storedUsers] = await Promise.all([
        getBusTripById(tripId),
        AsyncStorage.getItem(STORAGE_KEYS.SCANNED(tripId)),
      ]);

      if (trip) setBusTrip(trip);
      if (storedUsers) setScannedUsers(JSON.parse(storedUsers));
    } catch {
      showMessage("Erro ao sincronizar dados locais", "error");
    }
  }, [tripId, getBusTripById, showMessage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleScan = useCallback(
    async (data: string) => {
      try {
        let [userId, userName] = data.split(":");
        if (!userId || !userName) throw new Error("QR Code inválido");

        userName = userName.replaceAll("-", " ");

        const alreadyScanned = scannedUsers.some((u) => u.userId === userId);
        if (alreadyScanned) {
          return showMessage("Este usuário já foi escaneado", "error");
        }

        const updatedUsers = [...scannedUsers, { userId, userName }];

        await AsyncStorage.setItem(
          STORAGE_KEYS.SCANNED(tripId),
          JSON.stringify(updatedUsers),
        );
        setScannedUsers(updatedUsers);
        showMessage(`${userName} escaneado!`, "success");
      } catch {
        showMessage("Falha ao processar QR Code.", "error");
      }
    },
    [scannedUsers, tripId, showMessage],
  );

  if (!busTrip) return <LoadPage />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes da Viagem</Text>
      </View>

      <View style={styles.gap}>
        <BusTripCard trip={busTrip} />

        <View style={styles.cameraContainer}>
          <QrCodeReader onScan={handleScan} />
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>
          Passageiros ({scannedUsers.length})
        </Text>
        <Line />
        {scannedUsers.length === 0 ? (
          <Text style={styles.emptyText}>
            Nenhum passageiro escaneado ainda
          </Text>
        ) : (
          <FlatList
            data={scannedUsers}
            keyExtractor={(item) => item.userId}
            contentContainerStyle={styles.scrollContent}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Ionicons name="checkmark-circle" size={20} color={"#4CAF50"} />
                <Text style={styles.userText}>{item.userName}</Text>
              </View>
            )}
          />
        )}
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>
          Reservas ({scannedUsers.length})
        </Text>
        <Line />
        {scannedUsers.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum reserva feita ainda</Text>
        ) : (
          <FlatList
            data={scannedUsers}
            keyExtractor={(item) => item.userId}
            contentContainerStyle={styles.scrollContent}
            renderItem={({ item }) => (
              <View style={styles.userItem}>
                <Ionicons name="checkmark-circle" size={20} color={"#4CAF50"} />
                <Text style={styles.userText}>{item.userName}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 15,
  },
  backButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  gap: {
    gap: 20,
    margin: 20,
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    color: "#64748b",
    fontWeight: "700",
    marginBottom: 8,
  },
  dateDisplay: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    gap: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  cameraContainer: {
    height: 250,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  listContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    backgroundColor: "#fff",
    margin: 20,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "black",
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    gap: 10,
  },
  userText: {
    fontSize: 16,
    color: "#334155",
  },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
  },
});
