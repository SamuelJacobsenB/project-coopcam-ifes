import { I } from "../../../../components";
import { months } from "../../../../utils";

import styles from "./styles.module.css";

interface MonthlyFeeItemProps {
    month: number;
    isSelected: boolean;
    onClick: () => void;
}

export function MonthlyFeeItem({ month, isSelected, onClick }: MonthlyFeeItemProps) {
    return (
        <div
            className={`${styles.monthlyFeeItem} ${isSelected ? styles.active : ""}`}
            onClick={onClick}
        >
            <I.calendar size={16} />
            <strong>{months[month - 1]}</strong>
        </div>
    );
} ''