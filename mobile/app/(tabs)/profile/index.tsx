import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import * as Sharing from "expo-sharing";
import QRCode from "react-native-qrcode-svg";
import { captureRef } from "react-native-view-shot";

import { ConfirmModal, LoadPage, ProfileInfoText } from "@/components";
import { useMessage, useUser } from "@/contexts";
import { useLogout } from "@/hooks";
import { btnStyles, colors } from "@/styles";

// Componente para organizar as secções do perfil
const ProfileSectionCard = ({ title, children, icon }: any) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Ionicons
        name={icon}
        size={20}
        color={colors.primary}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <View style={styles.cardContent}>{children}</View>
  </View>
);

export default function ProfilePage() {
  const { user, setUser } = useUser();
  const { logout } = useLogout();
  const { showMessage } = useMessage();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardToCaptureRef = useRef<View>(null);

  const handleDownloadCard = async () => {
    if (!cardToCaptureRef.current) {
      showMessage("Erro ao gerar o cartão", "error");
      return;
    }

    setIsDownloading(true);

    try {
      const uri = await captureRef(cardToCaptureRef);
      await Sharing.shareAsync(uri);
      showMessage("Cartão gerado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao gerar cartão:", error);
      showMessage("Erro ao gerar o cartão", "error");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!user) return <LoadPage />;

  const userNameFormatted = user.name.split(" ").slice(0, 2).join(" ");
  const qrCodeValue = `${user.id}:${user.name.replaceAll(" ", "-")}`;

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Conteúdo Visível do App */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => setIsLogoutModalOpen(true)}
          >
            <View style={[btnStyles.btnRounded, styles.logoutButtonInner]}>
              <Ionicons name="log-out-outline" size={18} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <View style={styles.avatarIconWrapper}>
              <Ionicons name="person" size={60} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.nameText}>{userNameFormatted}</Text>
          <Text style={styles.emailText}>{user.email}</Text>
        </View>

        <View style={styles.bodyContainer}>
          <ProfileSectionCard title="Dados Pessoais" icon="person-outline">
            <ProfileInfoText label="Telefone" text={user.phone} />
            <ProfileInfoText label="Email" text={user.email} />
            <ProfileInfoText label="Endereço" text={user.address} />
          </ProfileSectionCard>
          <ProfileSectionCard title="Documentação" icon="document-text-outline">
            <View style={styles.twoColumnRow}>
              <ProfileInfoText label="CPF" text={user.cpf} />
              <ProfileInfoText label="Nascimento" text={user.birth} />
            </View>
          </ProfileSectionCard>
        </View>

        <View style={styles.qrSectionCard}>
          <Text style={styles.qrCodeAreaTitle}>Identificador Digital</Text>
          <View style={styles.qrCodeWrapperOutline}>
            <QRCode value={qrCodeValue} size={180} />
          </View>
          <TouchableOpacity
            style={[styles.downloadButton, isDownloading && { opacity: 0.6 }]}
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
                <Text style={styles.downloadButtonText}>Baixar Cartão</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* VIEW OCULTA */}
      <View style={styles.hiddenWrapper} pointerEvents="none">
        <View
          ref={cardToCaptureRef}
          collapsable={false}
          style={styles.hiddenCardContent}
        >
          <View style={styles.hiddenHeaderColor}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.hiddenLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.hiddenPaddingContainer}>
            <Text style={styles.hiddenLabel}>CARTÃO DE ACESSO</Text>
            <Text style={styles.hiddenName}>{userNameFormatted}</Text>
            <Text style={styles.hiddenEmail}>{user.email}</Text>

            <View style={styles.hiddenQrWrapper}>
              <QRCode value={qrCodeValue} size={220} quietZone={10} />
            </View>

            <Text style={styles.hiddenFooter}>Documento Digital</Text>
          </View>
        </View>
      </View>

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
  mainContainer: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 40 },
  headerContainer: { alignItems: "center", marginBottom: 25 },
  logoutButton: { position: "absolute", top: 0, right: 0, zIndex: 10 },
  logoutButtonInner: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ff4d4d",
    borderRadius: 18,
  },
  avatarContainer: { marginBottom: 12 },
  avatarIconWrapper: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  nameText: { fontSize: 22, fontWeight: "bold", color: "#333" },
  emailText: { fontSize: 14, color: "#666" },
  bodyContainer: { gap: 16, marginBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 5,
  },
  cardTitle: { fontSize: 15, fontWeight: "bold", color: "#333" },
  cardContent: { gap: 10 },
  twoColumnRow: { flexDirection: "row", justifyContent: "space-between" },
  qrSectionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 3,
  },
  qrCodeAreaTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 15,
  },
  qrCodeWrapperOutline: {
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 20,
  },
  downloadButton: {
    flexDirection: "row",
    backgroundColor: "#2ecc71",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  downloadButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Estilos do Cartão Gerado (Oculto)
  hiddenWrapper: {
    position: "absolute",
    left: 0,
    top: 0,
    zIndex: -9999,
    opacity: 0,
  },
  hiddenCardContent: {
    width: 450, // Largura maior para melhor resolução
    backgroundColor: "#fff",
    alignItems: "center",
    overflow: "hidden",
  },
  hiddenHeaderColor: {
    width: "100%",
    height: 100,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  hiddenLogo: {
    width: 180,
    height: 90,
  },
  hiddenPaddingContainer: {
    width: "100%",
    paddingHorizontal: 40,
    alignItems: "center",
    paddingBottom: 50,
  },
  hiddenLabel: {
    fontSize: 16,
    color: "#888",
    letterSpacing: 2,
    marginBottom: 10,
  },
  hiddenName: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  hiddenEmail: {
    fontSize: 20,
    color: "#555",
    marginBottom: 30,
  },
  hiddenQrWrapper: {
    padding: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 25,
    marginBottom: 30,
  },
  hiddenFooter: {
    fontSize: 14,
    color: "#bbb",
    textTransform: "uppercase",
  },
});
