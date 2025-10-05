import React, { useEffect } from "react";
import {
  Modal as ReactNativeModal,
  View,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";

import * as SystemUI from "expo-system-ui";
import { Ionicons } from "@expo/vector-icons";

import styles from "./styles";
import { colors } from "@/styles";

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
    <>
      <ReactNativeModal transparent visible={isOpen} animationType="fade">
        <View
          style={[
            styles.background,
            { height: Dimensions.get("window").height },
          ]}
        >
          <StatusBar backgroundColor={"black"} />
          <View style={styles.modalArea}>
            <TouchableOpacity onPress={onClose} style={styles.close}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <View style={styles.card}>{children}</View>
          </View>
        </View>
      </ReactNativeModal>
    </>
  );
}
