import React from "react";
import { Image, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import { Line } from "../../line";
import styles from "./styles";

interface UserAccessCardProps {
  name: string;
  qrCodeValue: string;
}

export const UserAccessCard = React.forwardRef<View, UserAccessCardProps>(
  ({ name, qrCodeValue }, ref) => {
    return (
      <View style={styles.hiddenWrapper} pointerEvents="none">
        <View ref={ref} collapsable={false} style={styles.cardContainer}>
          <View style={styles.infoSection}>
            <View style={styles.header}>
              <Image
                source={require("@/assets/images/logo.png")}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.userSection}>
              <Text style={styles.label}>PASSAGEIRO</Text>
              <Text style={styles.name} numberOfLines={2}>
                {name}
              </Text>
              <Line />
              <Text style={styles.presentationText}>
                Passe individual e intransfeŕivel. Obrigatória a apresentação.
              </Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.documentText}>
                Documento Digital - Apresentar na entrada
              </Text>
            </View>
          </View>

          <View style={styles.qrSection}>
            <View style={styles.qrWrapper}>
              <QRCode value={qrCodeValue} size={200} quietZone={10} />
            </View>
            <Text style={styles.scanText}>Aproxime do leitor</Text>
          </View>
        </View>
      </View>
    );
  },
);

UserAccessCard.displayName = "UserAccessCard";
