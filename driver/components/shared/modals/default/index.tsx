import React, { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import * as SystemUI from "expo-system-ui";

import { colors } from "@/styles";

import styles from "./styles";

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export function Modal({ children, isOpen, onClose }: ModalProps) {
  useEffect(() => {
    if (isOpen) SystemUI.setBackgroundColorAsync("black");
    else SystemUI.setBackgroundColorAsync(colors.primary);
  }, [isOpen]);

  return (
    <RNModal
      transparent
      visible={isOpen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.background}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalArea}
          >
            <TouchableWithoutFeedback>
              <View style={styles.contentWrapper}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={onClose}
                  style={styles.close}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color="#64748b" />
                </TouchableOpacity>

                <View style={styles.modalCard}>{children}</View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}
