import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";

import { ConfirmModal, LoadPage, UserAccessCard } from "@/components";
import { useMessage, useUser } from "@/contexts";
import { useLogout } from "@/hooks";
import { colors } from "@/styles";

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const { logout } = useLogout();
  const { showMessage } = useMessage();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardToCaptureRef = useRef<View>(null);

  if (!user) return <LoadPage />;

  const userNameFormatted = user.name.split(" ").slice(0, 2).join(" ");
  const qrCodeValue = `${user.id}:${user.name.replaceAll(" ", "-")}`;

  const handleDownloadCard = async () => {
    if (!cardToCaptureRef.current) {
      showMessage("Erro ao acessar a visualização do cartão.", "error");
      return;
    }

    try {
      setIsDownloading(true);

      const uri = await captureRef(cardToCaptureRef, {
        format: "png",
        quality: 1,
      });

      await Sharing.shareAsync(uri);
      showMessage("Cartão gerado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao gerar cartão:", error);
      showMessage("Erro ao gerar o cartão", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => setIsLogoutModalOpen(true)}
          >
            <Ionicons name="log-out-outline" size={24} color={colors.error} />
          </TouchableOpacity>
          <Ionicons name="person-circle" size={160} color={colors.primary} />
          <Text style={styles.name}>{userNameFormatted}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Dados do Usuário</Text>
          <InfoRow label="Telefone" value={user.phone} />
          <InfoRow label="Endereço" value={user.address} />
          <InfoRow
            label="CEP"
            value={user.cep.slice(0, 5) + "-" + user.cep.slice(5, 8)}
          />
          <InfoRow
            label="CPF"
            value={user.cpf.replace(
              /(\d{3})(\d{3})(\d{3})(\d{2})/,
              "$1.$2.$3-$4",
            )}
          />
          <InfoRow label="Nascimento" value={user.birth} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Identificador Digital</Text>
          <View style={styles.qrContainer}>
            <QRCode value={qrCodeValue} size={160} />
          </View>
          <TouchableOpacity
            style={[styles.downloadBtn, isDownloading && { opacity: 0.7 }]}
            onPress={handleDownloadCard}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="download-outline"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.downloadBtnText}>Baixar Cartão</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <UserAccessCard
        name={userNameFormatted}
        qrCodeValue={qrCodeValue}
        ref={cardToCaptureRef}
      />

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          await logout();
          setUser(null);
          router.navigate("/login");
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollArea: { padding: 20, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 20, position: "relative" },
  logoutBtn: { position: "absolute", top: 10, right: 0, padding: 8 },
  name: { fontSize: 24, fontWeight: "bold", color: "#333", marginTop: 8 },
  email: { fontSize: 14, color: "#666" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  infoLabel: { fontSize: 14, fontWeight: "800" },
  infoValue: { fontSize: 14, color: "#333", flexShrink: 1, textAlign: "right" },
  qrContainer: {
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    marginBottom: 15,
  },
  downloadBtn: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  downloadBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
