import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { InfoCard, Title } from "@/components";
import { colors } from "@/styles";

export default function InfoPage() {
  return (
    <View style={styles.container}>
      <Title>Informações</Title>
      <InfoCard title="Rota">
        <Text>Alguma rota</Text>
      </InfoCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: colors.lightGray,
  },
});
