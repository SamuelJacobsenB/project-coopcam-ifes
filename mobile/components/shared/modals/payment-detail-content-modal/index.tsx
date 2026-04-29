import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import QRCode from "react-native-qrcode-svg";

import { MonthlyPayment } from "@/types";
import { useMessage } from "@/contexts";

import { Modal } from "../default";

import styles from "./styles";

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
  const hasReceipt = !!payment.receipt_url;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (date: Date | string | null) =>
    date ? new Date(date).toLocaleDateString("pt-BR") : "—";

  const handleCopyPix = async () => {
    if (payment.pix_qr_code) {
      await Clipboard.setStringAsync(payment.pix_qr_code);
      showMessage("Código PIX copiado para a área de transferência.", "success");
    }
  };

  const handleOpenUrl = () => {
    if (payment.payment_url) {
      Linking.openURL(payment.payment_url).catch(() =>
        showMessage("Não foi possível abrir o link de pagamento.", "error")
      );
    }
  };

  const handleViewReceipt = () => {
    if (payment.receipt_url) {
      Linking.openURL(payment.receipt_url).catch(() =>
        showMessage("Não foi possível abrir o comprovante.", "error")
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
            <Text style={styles.value}>{formatCurrency(payment.amount)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Vencimento:</Text>
            <Text style={styles.value}>{formatDate(payment.due_date)}</Text>
          </View>
          {isPaid && payment.paid_at && (
            <View style={styles.row}>
              <Text style={styles.label}>Pago em:</Text>
              <Text style={[styles.value, styles.paidDate]}>
                {formatDate(payment.paid_at)}
              </Text>
            </View>
          )}
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
          <View style={styles.paidContainer}>
            <View style={styles.successIconBadge}>
              <Ionicons name="checkmark-circle" size={48} color="#22c55e" />
            </View>
            <Text style={styles.paidTextTitle}>Pagamento Realizado!</Text>

            {hasReceipt ? (
              <TouchableOpacity
                style={styles.receiptButton}
                onPress={handleViewReceipt}
                activeOpacity={0.7}
              >
                <Ionicons name="document-text-outline" size={20} color="#fff" />
                <Text style={styles.receiptButtonText}>
                  Visualizar comprovante
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.warningContainer}>
                <Ionicons name="warning-outline" size={20} color="#e6b400" />
                <Text style={styles.warningText}>
                  Comprovante não disponível. Entre em contato com o administrador.
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </Modal>
  );
}