import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, I } from "../../../../components";
import type { BusTripReport } from "../../../../types";

import styles from "./styles.module.css";

interface BusReportsCardProps {
  reports: BusTripReport[];
}

export function BusReportsCard({ reports }: BusReportsCardProps) {
  const navigate = useNavigate();

  const [isReportsOpen, setIsReportsOpen] = useState(false);

  return (
    <Card className={styles.reportsBox}>
      {reports.length > 0 && (
        <button
          className={styles.reportsBoxButton}
          onClick={() => setIsReportsOpen(!isReportsOpen)}
        >
          {isReportsOpen ? <I.arrow_down /> : <I.arrow_up />}
        </button>
      )}

      <h2>Relatórios</h2>

      {isReportsOpen && reports.length > 0 && (
        <>
          <hr style={{ margin: "1rem 0", opacity: 0.2 }} />
          <ul className={styles.reportsList}>
            {reports.map((report) => (
              <li key={report.id}>
                <div
                  onClick={() => navigate(`/usuarios/${report.user_id}`)}
                  className={styles.userCard}
                >
                  <p>{report.user_name}</p>
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
                        <I.alert_circle size={16} />{" "}
                        <small>Marcou e Faltou</small>
                      </>
                    )}

                    {!report.marked && report.attended && (
                      <>
                        <I.warning size={16} /> <small>Não marcou e Foi</small>
                      </>
                    )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  );
}
