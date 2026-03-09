import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

import { Modal } from "../default";

import styles from "./styles";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title?: string;
  description?: string;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar ação",
  description = "Tem certeza que deseja realizar essa ação? Esta ação pode ser irreversível.",
}: ConfirmModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Erro ao confirmar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>{title}</Text>

        <View style={styles.hr} />

        <Text style={styles.description}>{description}</Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[styles.button, styles.btnSecondary]}
            onPress={onClose}
            disabled={loading}
          >
            <Text style={styles.btnSecondaryText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.button,
              styles.btnSuccess,
              loading && styles.btnDisabled,
            ]}
            onPress={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.btnSuccessText}>Confirmar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
