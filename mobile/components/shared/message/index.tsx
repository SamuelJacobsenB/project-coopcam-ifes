import React, { useEffect, useRef } from "react";
import { Animated, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMessage } from "../../../contexts";

import styles from "./styles";

export const Message = () => {
  const { message, closeMessage } = useMessage();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (message?.text) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 30,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => closeMessage());
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [message, closeMessage, opacity, translateY]);

  if (!message?.text) return null;

  return (
    <Animated.View
      style={[
        styles.message,
        message.type === "success" ? styles.success : styles.error,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {message.type === "success" && (
        <Ionicons name="checkmark-circle" size={20} style={styles.icon} />
      )}
      {message.type === "error" && (
        <Ionicons name="close-circle" size={20} style={styles.icon} />
      )}
      <Text style={styles.text}>{message.text}</Text>
      <TouchableOpacity onPress={closeMessage} style={styles.close}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};
