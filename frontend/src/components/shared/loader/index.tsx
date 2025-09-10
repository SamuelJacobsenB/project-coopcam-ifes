import { I } from "../../icons";

import styles from "./styles.module.css";

interface LoaderProps {
  color?: string;
  size?: number;
}

export function Loader({ color, size }: LoaderProps) {
  return <I.loader className={styles.loader} color={color} size={size} />;
}
