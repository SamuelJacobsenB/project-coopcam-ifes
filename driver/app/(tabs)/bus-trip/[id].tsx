import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { BusTripCard, LoadPage, QrCodeReader } from "@/components";
import { useMessage } from "@/contexts";
import { useBusTripById, useManyBusReservationsByTripId } from "@/hooks";
import { colors } from "@/styles";
import { BusTrip, ScannedUser, Status } from "@/types";

// Constantes para evitar erros de digitação nas chaves
const STORAGE_KEYS = {
  SCANNED: (id: string) => `@scanned_users_${id}`,
  RESERVATIONS: (id: string) => `@reservations_${id}`,
};

export default function BusTripPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const tripId = id || "";

  const { showMessage } = useMessage();
  const { getBusTripById } = useBusTripById();
  const { getManyBusReservationsByTripId } = useManyBusReservationsByTripId();

  const [busTrip, setBusTrip] = useState<BusTrip | null>(null);
  const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);

  // Carregar dados iniciais
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
      showMessage("Erro ao sincronizar dados locais.", "error");
    }
  }, [tripId, getBusTripById, showMessage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handler de Scan memorizado
  const handleScan = useCallback(
    async (data: string) => {
      try {
        let [userId, userName] = data.split(":");
        if (!userId || !userName) throw new Error("QR Code inválido");

        userName = userName.replaceAll("-", " ");

        const alreadyScanned = scannedUsers.some((u) => u.userId === userId);
        if (alreadyScanned) {
          return showMessage("Este usuário já foi escaneado.", "error");
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

  async function handleStatusChange(newStatus: Status) {
    if (!busTrip) return;
    setBusTrip((prev) => (prev ? { ...prev, status: newStatus } : null));

    try {
      const reservas = await getManyBusReservationsByTripId(tripId);
      await AsyncStorage.setItem(
        STORAGE_KEYS.RESERVATIONS(tripId),
        JSON.stringify(reservas),
      );
    } catch (error) {
      console.error("Erro ao fazer backup offline:", error);
    }
  }

  if (!busTrip) return <LoadPage />;

  return (
    <View style={styles.container}>
      {/* Header com botão de voltar melhorado */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </Pressable>
        <Text style={styles.headerTitle}>Detalhes da Viagem</Text>
      </View>

      <FlatList
        data={scannedUsers}
        keyExtractor={(item) => item.userId}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.gap}>
            <BusTripCard trip={busTrip} />

            <View style={styles.card}>
              <Text style={styles.label}>Status da Viagem</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={busTrip.status}
                  onValueChange={(val) => handleStatusChange(val as Status)}
                  style={styles.picker}
                >
                  <Picker.Item label="Pendente" value="PENDING" />
                  <Picker.Item label="Em Andamento" value="IN_PROGRESS" />
                  <Picker.Item label="Concluída" value="COMPLETED" />
                </Picker>
              </View>
            </View>

            <View style={styles.cameraContainer}>
              <QrCodeReader onScan={handleScan} />
            </View>

            <Text style={styles.sectionTitle}>
              Passageiros a bordo ({scannedUsers.length})
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <Ionicons name="checkmark-circle" size={20} color={"#4CAF50"} />
            <Text style={styles.userText}>{item.userName}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum passageiro escaneado.</Text>
        }
      />
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
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
  pickerWrapper: {
    backgroundColor: "#f8fafc",
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  picker: {
    height: 50,
  },
  cameraContainer: {
    height: 250, // Altura fixa para a câmera não quebrar o layout
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "black",
    marginTop: 10,
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
    marginTop: 20,
  },
});
