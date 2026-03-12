import { View } from "lucide-react-native";

import { CameraView, useCameraPermissions } from "expo-camera";

import { LoadPage } from "@/components/layout";

import { ConfirmModal } from "../modals";
import styles from "./styles";

interface QrCodeReaderProps {
  onScan: (data: string) => Promise<void>;
}

export function QrCodeReader({ onScan }: QrCodeReaderProps) {
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <LoadPage />;
  }

  if (!permission.granted) {
    return (
      <ConfirmModal
        isOpen={true}
        onClose={() => {}}
        title="Permissão"
        description="Permita o acesso à câmera para que seja possível escanear os qr-codes."
        onConfirm={async () => {
          await requestPermission();
        }}
      />
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={{ width: "100%", height: "100%" }}
        facing="front"
        onBarcodeScanned={async (evt) => {
          await onScan(evt.data);
        }}
      />
    </View>
  );
}
