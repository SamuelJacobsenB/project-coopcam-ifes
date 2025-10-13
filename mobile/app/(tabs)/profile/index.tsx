import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import QRCode from "react-native-qrcode-svg";

import { router } from "expo-router";

import { useUser } from "@/contexts";
import { useLogout } from "@/hooks";
import { ConfirmModal, Line, LoadPage, ProfileInfoText } from "@/components";
import { Ionicons } from "@expo/vector-icons";
import { btnStyles } from "@/styles";

export default function ProfilePage() {
  const { user } = useUser();
  const { logout } = useLogout();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  if (!user) return <LoadPage />;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setIsLogoutModalOpen(true)}
      >
        <Text style={[btnStyles.btnRounded, btnStyles.btnDanger]}>
          <Ionicons name="log-out-outline" size={16} color="#fff" />
        </Text>
      </TouchableOpacity>
      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={async () => {
          await logout();
          router.push("/login");
        }}
      />

      <View style={styles.header}>
        <View style={styles.avatar}>
          {user.avatar_url ? (
            ""
          ) : (
            <Ionicons name="person-circle" style={styles.icon} />
          )}
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name}>
            {user.name.split(" ").splice(0, 2).join(" ")}
          </Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>
      </View>
      <Line />
      <View style={styles.body}>
        <View style={styles.bodySection}>
          <ProfileInfoText label="Email" text={user.email} />
          <ProfileInfoText label="Telefone" text={user.phone} />
          <ProfileInfoText label="Endereço" text={user.address} />
        </View>
        <View style={styles.bodySection}>
          <ProfileInfoText label="CPF" text={user.cpf} />
          <ProfileInfoText label="CEP" text={user.cep} />
          <ProfileInfoText label="Nascimento" text={user.birth} />
        </View>
      </View>
      <Line />
      <View style={styles.qrCodeArea}>
        <Text style={styles.qrCodeAreaTitle}>Identificador do usuário</Text>
        <Text style={styles.qrCodeAreaText}>
          Passe este identificador (QR code) ao entrar no seu veículo de
          transporte para que haja um correto registro das informações.
        </Text>
        <View style={styles.qrCodeContainer}>
          <QRCode
            value={user.id + ":" + user.email}
            size={160}
            color="black"
            backgroundColor="white"
          />
        </View>
        <Text style={styles.qrCodeAreaText}>
          Observação: Não compartilhe seu identificador, não use o identificador
          de outro usuário nem deixe de passar seu identificador ao entrar no
          veículo.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  logoutButton: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  avatar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    height: 100,
  },
  icon: {
    fontSize: 100,
  },
  headerInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  name: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  email: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  body: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    padding: 20,
  },
  bodySection: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  qrCodeArea: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: 20,
  },
  qrCodeAreaTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  qrCodeAreaText: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    textAlign: "justify",
  },
  qrCodeContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 12,
  },
});
