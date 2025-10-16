import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

import { Modal } from "../default";
import { Line } from "../../line";

import styles from "./styles";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Text style={styles.title}>Confirmar ação</Text>
      <Line />
      <Text style={styles.message}>
        Tem certeza que deseja realizar essa ação? Esta ação pode ser
        irreversível.
      </Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, styles.success]}
          onPress={async () => {
            try {
              await onConfirm();
            } finally {
              onClose();
            }
          }}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.danger]}
          onPress={onClose}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
