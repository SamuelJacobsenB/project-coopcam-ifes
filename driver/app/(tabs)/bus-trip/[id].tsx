import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import {
  BusTripCard,
  ConfirmModal,
  Line,
  LoadPage,
  QrCodeReader,
} from "@/components";
import { useMessage } from "@/contexts";
import {
  useBusTripById,
  useCreateManyBusTripReports,
  useManyBusReservationsByTripId,
} from "@/hooks";
import { colors } from "@/styles";
import { BusReservation, BusTrip, ScannedUser } from "@/types";
import {
  getReservationsByTripId,
  getScannedUsersByTripId,
  getBusTripById as getStoredBusTrip,
  setBusTripById,
  setReservationsByTripId,
  setScannedUsersByTripId,
  validateScannedUser,
} from "@/utils";

export default function BusTripPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showMessage } = useMessage();

  const { getBusTripById: fetchBusTripApi } = useBusTripById();
  const { getManyBusReservationsByTripId: fetchReservationsApi } =
    useManyBusReservationsByTripId();

  const { createManyBusTripReports } = useCreateManyBusTripReports();

  const [busTrip, setBusTrip] = useState<BusTrip | null>(null);
  const [reservations, setReservations] = useState<BusReservation[]>([]);
  const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setBusTrip(null);
    setReservations([]);
    setScannedUsers([]);

    try {
      const [storedTrip, storedScanned, storedReservations] = await Promise.all(
        [
          getStoredBusTrip(id),
          getScannedUsersByTripId(id),
          getReservationsByTripId(id),
        ],
      );

      if (storedTrip) setBusTrip(storedTrip);
      if (storedScanned) setScannedUsers(storedScanned);
      if (storedReservations) setReservations(storedReservations);

      try {
        const [freshTrip, freshReservations] = await Promise.all([
          fetchBusTripApi(id),
          fetchReservationsApi(id),
        ]);

        if (freshTrip) {
          setBusTrip(freshTrip);
          await setBusTripById(id, freshTrip);
        }

        if (freshReservations) {
          setReservations(freshReservations);
          await setReservationsByTripId(id, freshReservations);
        }
      } catch {
        console.log("Offline: Usando dados persistidos localmente.");
      }
    } catch {
      console.error("Erro ao acessar Storage");
      showMessage("Erro ao carregar dados locais", "error");
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

        const newUser: ScannedUser = {
          userId,
          userName,
        };

        if (!validateScannedUser(newUser)) {
          return showMessage("QR Code inválido", "error");
        }

        if (scannedUsers.some((u) => u.userId === newUser.userId)) {
          return showMessage(`${userName} já realizou o scaneamento`, "error");
        }

        const hasReservation = reservations.some(
          (res) => res.user_id === newUser.userId,
        );

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

  const handleCreateReports = async () => {
    if (!id || !busTrip) return;

    try {
      await createManyBusTripReports(busTrip.id);
      showMessage("Relatórios criados com sucesso", "success");
      router.back();
    } catch {
      showMessage("Erro ao criar relatórios", "error");
    }
  };

  if (loading) return <LoadPage />;

  if (!busTrip) {
    return (
      <View style={styles.container}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <View
          style={{
            alignItems: "center",
            marginHorizontal: 20,
            marginTop: 40,
            padding: 16,
            borderRadius: 12,
            backgroundColor: "#fff",
          }}
        >
          <Text style={styles.emptyText}>
            Viagem não encontrada ou você está offline sem dados salvos.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Pressable>

      {scannedUsers.length > 0 && (
        <Pressable
          onPress={() => setShowCreateModal(true)}
          style={styles.createReportsButton}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>
            Gerar relatórios
          </Text>
        </Pressable>
      )}

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

      <ConfirmModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreateReports}
        title="Gerar Relatórios"
        description="Tem certeza que deseja gerar os relatórios de embarque? Esta ação não pode ser desfeita."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.lightGray },
  backButton: { margin: 16 },
  createReportsButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: colors.secondary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  scrollContent: { padding: 20, gap: 20 },
  section: { backgroundColor: "#fff", padding: 16, borderRadius: 12, gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800" },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f1f5f9",
    borderLeftWidth: 4,
    borderLeftColor: "#3333333b",
  },
  userText: { fontSize: 16, color: "#334155" },
  warningSubtext: { fontSize: 12, color: "#EAB308", fontWeight: "600" },
  emptyText: { textAlign: "center", color: "#94a3b8", fontStyle: "italic" },
});
