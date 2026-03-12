import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

import { ArrowLeft, ArrowRight, Moon, Sun } from "lucide-react-native";

import type { BusTrip } from "@/types";

import styles from "./styles";

interface BusTripCardProps {
  trip: BusTrip;
  onPress?: () => void;
}

export function BusTripCard({ trip, onPress }: BusTripCardProps) {
  const isGo = trip.direction === "go";
  const isMorning = trip.period === "morning";

  const dateString = new Date(trip.date).toLocaleDateString("pt-BR");

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      <View style={styles.mainContent}>
        <View style={styles.dateContainer}>
          {isMorning ? (
            <Sun size={20} color="#eab308" />
          ) : (
            <Moon size={20} color="#6366f1" />
          )}
          <Text style={styles.dateText}>{dateString}</Text>
        </View>
        <Text style={styles.routeText}>{isGo ? "Ida" : "Retorno"}</Text>
      </View>

      <View style={[styles.badge, isGo ? styles.badgeGo : styles.badgeBack]}>
        {isGo ? (
          <ArrowRight size={14} color="#047857" />
        ) : (
          <ArrowLeft size={14} color="#1d4ed8" />
        )}
        <Text
          style={[
            styles.badgeText,
            isGo ? styles.badgeTextGo : styles.badgeTextBack,
          ]}
        >
          {isGo ? "Ida" : "Volta"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
