import { I } from "../../../../components";
import type { BusTripReport } from "../../../../types";

import styles from "./styles.module.css";

interface UserReportCardProps {
  report: BusTripReport;
}

export function UserReportCard({ report }: UserReportCardProps) {
  return (
    <div className={styles.userReportCard}>
      <header className={styles.userReportCardHeader}>
        <span>
          <I.calendar />{" "}
          <p>
            {report.date.toLocaleDateString()} -{" "}
            {report.direction === "go" ? "Ida" : "Volta"}
          </p>
        </span>
        <span>
          {report.period === "morning" ? (
            <>
              <I.sun />
              <p>Manhã</p>
            </>
          ) : (
            <>
              <I.moon />
              <p>Tarde</p>
            </>
          )}
        </span>
      </header>

      <span
        className={`${styles.badge} ${report.marked && report.attended && styles.markedAndAttended} ${report.marked && !report.attended && styles.markedAndNotAttended} ${!report.marked && report.attended && styles.notMarkedAndAttended}
                    `}
      >
        {report.marked && report.attended && (
          <>
            <I.check size={16} /> <small>Marcou e Foi</small>
          </>
        )}

        {report.marked && !report.attended && (
          <>
            <I.alert_circle size={16} /> <small>Marcou e Faltou</small>
          </>
        )}

        {!report.marked && report.attended && (
          <>
            <I.warning size={16} /> <small>Não marcou e Foi</small>
          </>
        )}
      </span>
    </div>
  );
}
