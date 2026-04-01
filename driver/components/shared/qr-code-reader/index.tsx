import { LoadPage } from "@/components/layout";
import { CameraView, useCameraPermissions } from "expo-camera";
import { View } from "react-native";
import { ConfirmModal } from "../modals";
import styles from "./styles";

interface QrCodeReaderProps {
  onScan: (data: string) => Promise<void>;
}

export function QrCodeReader({ onScan }: QrCodeReaderProps) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <LoadPage />;

  if (!permission.granted) {
    return (
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        title="Permissão"
        description="Permita o acesso à câmera para escanear os QR Codes"
        onConfirm={async () => {
          await requestPermission();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="front"
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={async (evt) => {
          if (evt.data) {
            await onScan(evt.data);
          }
        }}
      >
        {/* Máscara visual do scanner */}
        <View style={styles.overlay}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.middleContainer}>
            <View style={styles.unfocusedContainer} />
            <View style={styles.focusedContainer} />
            <View style={styles.unfocusedContainer} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>
      </CameraView>
    </View>
  );
}
