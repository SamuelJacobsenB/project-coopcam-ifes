import { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";

import { BusTripCard, Line, LoadPage, QrCodeReader } from "@/components";
import { useMessage } from "@/contexts";
import { useBusTripById, useManyBusReservationsByTripId } from "@/hooks";
import { colors } from "@/styles";
import { BusTrip, ScannedUser, Status } from "@/types";

export default function BusTripPage() {
  const { id } = useLocalSearchParams();
  const tripId = typeof id === "string" ? id : "";

  const { showMessage } = useMessage();

  const { getBusTripById } = useBusTripById();
  const { getManyBusReservationsByTripId } = useManyBusReservationsByTripId();

  const [busTrip, setBusTrip] = useState<BusTrip | null>(null);
  const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);

  const loadScannedUsers = useCallback(async () => {
    try {
      const storedUsers = await AsyncStorage.getItem(
        `@scanned_users_${tripId}`,
      );
      if (storedUsers) {
        setScannedUsers(JSON.parse(storedUsers));
      }
    } catch {
      showMessage(
        "Erro ao carregar os usuários escaneados do armazenamento local",
        "error",
      );
    }
  }, [tripId, showMessage]);

  useEffect(() => {
    if (tripId) {
      getBusTripById(tripId).then((trip) => setBusTrip(trip));
      loadScannedUsers();
    }
  }, [tripId, getBusTripById, loadScannedUsers]);

  async function handleScan(data: string) {
    let [userId, userName] = data.split(":");
    userName = userName.replaceAll("-", " ");

    const newUser: ScannedUser = {
      userId,
      userName,
    };

    try {
      const storedData = await AsyncStorage.getItem(`@scanned_users_${tripId}`);
      const currentUsers: ScannedUser[] = storedData
        ? JSON.parse(storedData)
        : [];

      const userAlreadyScanned = currentUsers.some(
        (user) => user.userId === userId,
      );

      if (!userAlreadyScanned) {
        const updatedUsers = [...currentUsers, newUser];

        await AsyncStorage.setItem(
          `@scanned_users_${tripId}`,
          JSON.stringify(updatedUsers),
        );

        setScannedUsers(updatedUsers);
        showMessage(`Usuário ${userName} escaneado com sucesso!`, "success");
      } else {
        showMessage("Este usuário já foi escaneado.", "error");
      }
    } catch {
      showMessage(
        "Erro ao salvar o usuário escaneado no armazenamento local",
        "error",
      );
    }
  }

  // Fazer chamada a API para atualizar o status da viagem e salvar as reservas offline
  async function handleStatusChange(newStatus: Status) {
    if (!busTrip) return;

    setBusTrip({ ...busTrip, status: newStatus });

    try {
      const reservas = await getManyBusReservationsByTripId(tripId);

      await AsyncStorage.setItem(
        `@reservations_${tripId}`,
        JSON.stringify(reservas),
      );

      console.log("Status atualizado e reservas salvas offline!");
    } catch (error) {
      console.error("Erro ao salvar as reservas no armazenamento", error);
    }
  }

  if (!busTrip) {
    return <LoadPage />;
  }

  return (
    <View style={styles.container}>
      <Link href={"/"} style={styles.backLink}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </Link>

      <BusTripCard trip={busTrip} />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Status da Viagem:</Text>
        <Picker
          selectedValue={busTrip.status}
          onValueChange={(itemValue) => handleStatusChange(itemValue as Status)}
          style={styles.picker}
        >
          <Picker.Item label="Pendente" value="PENDING" />
          <Picker.Item label="Em Andamento" value="IN_PROGRESS" />
          <Picker.Item label="Concluída" value="COMPLETED" />
        </Picker>
      </View>

      <Line />

      <QrCodeReader onScan={handleScan} />

      <Line />

      <View style={styles.listContainer}>
        <Text style={styles.title}>Usuários Escaneados (Offline)</Text>
        <FlatList
          data={scannedUsers}
          keyExtractor={(item) => item.userId}
          renderItem={({ item }) => (
            <Text style={styles.userText}>• {item.userName}</Text>
          )}
          ListEmptyComponent={<Text>Nenhum passageiro escaneado ainda.</Text>}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 16,
    backgroundColor: colors.lightGray,
  },
  backLink: {
    position: "absolute",
    top: 32,
    left: 24,
    zIndex: 10,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  picker: {
    height: 50,
    width: "100%",
  },
  listContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userText: {
    fontSize: 16,
    paddingVertical: 4,
  },
});
