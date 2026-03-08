import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import QRCode from "react-native-qrcode-svg";

import { MonthlyPayment } from "@/types";

import { useMessage } from "@/contexts";
import { Modal } from "../default";
import { styles } from "./styles";

interface PaymentDetailContentModalProps {
  payment: MonthlyPayment | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentDetailContentModal({
  payment,
  isOpen,
  onClose,
}: PaymentDetailContentModalProps) {
  const { showMessage } = useMessage();

  if (!payment) return null;

  const isPaid = payment.payment_status === "paid";

  const handleCopyPix = async () => {
    if (payment.pix_qr_code) {
      await Clipboard.setStringAsync(payment.pix_qr_code);
      showMessage(
        "Código PIX copiado para a área de transferência.",
        "success",
      );
    }
  };

  const handleOpenUrl = () => {
    if (payment.payment_url) {
      Linking.openURL(payment.payment_url).catch(() =>
        showMessage("Não foi possível abrir o link de pagamento.", "error"),
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Detalhes do Pagamento</Text>

        {!isPaid && payment.pix_qr_code && (
          <View style={styles.qrContainer}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={payment.pix_qr_code}
                size={160}
                color="#1e293b"
                backgroundColor="white"
              />
            </View>
            <Text style={styles.qrHint}>Escaneie o QR Code para pagar</Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Valor:</Text>
            <Text style={styles.value}>
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(payment.amount)}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vencimento:</Text>
            <Text style={styles.value}>
              {new Date(payment.due_date).toLocaleDateString("pt-BR")}
            </Text>
          </View>
        </View>

        {!isPaid ? (
          <View style={styles.actions}>
            {payment.pix_qr_code && (
              <TouchableOpacity
                style={styles.pixButton}
                onPress={handleCopyPix}
                activeOpacity={0.8}
              >
                <Ionicons name="copy-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Copiar Código PIX</Text>
              </TouchableOpacity>
            )}

            {payment.payment_url && (
              <TouchableOpacity
                style={styles.linkButton}
                onPress={handleOpenUrl}
                activeOpacity={0.7}
              >
                <Ionicons name="browsers-outline" size={20} color="#64748b" />
                <Text style={styles.linkButtonText}>Pagar via Navegador</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.paidMessage}>
            <View style={styles.successIconBadge}>
              <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
            </View>
            <Text style={styles.paidTextTitle}>Pagamento Realizado!</Text>
            <Text style={styles.paidTextSubtitle}>
              Este pagamento já foi processado com sucesso.
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}
