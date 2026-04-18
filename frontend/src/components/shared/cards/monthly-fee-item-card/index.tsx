import { I } from "../../../../components";
import { months } from "../../../../utils";

import styles from "./styles.module.css";

interface MonthlyFeeItemCardProps {
  month: number;
  isSelected: boolean;
  onClick: () => void;
}

export function MonthlyFeeItemCard({
  month,
  isSelected,
  onClick,
}: MonthlyFeeItemCardProps) {
  return (
    <div
      className={`${styles.monthlyFeeItem} ${isSelected ? styles.active : ""}`}
      onClick={onClick}
    >
      <I.calendar size={16} />
      <strong>{months[month - 1]}</strong>
    </div>
  );
}
