import type { Direction } from "../../../../types";

import styles from "./styles.module.css";

interface DirectionBadgeProps {
  direction: Direction;
}

export function DirectionBadge({ direction }: DirectionBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[direction]}`}>
      {direction === "go" ? "IDA" : "VOLTA"}
    </span>
  );
}
