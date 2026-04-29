import { Modal } from "../../modals";
import { PaymentStatusBadge } from "../../badges";

import type { MonthlyPayment } from "../../../../types";

import styles from "./styles.module.css";

interface PaymentDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    payment: MonthlyPayment;
}

export function PaymentDetailsModal({ isOpen, onClose, payment }: PaymentDetailsModalProps) {
    if (!payment) return null;

    const formatCurrency = (value: number) =>
        value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    const formatDate = (date: Date | string | null) =>
        date ? new Date(date).toLocaleDateString("pt-BR") : "—";

    const handleViewReceipt = () => {
        if (payment.receipt_url) {
            window.open(payment.receipt_url, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className={styles.modalContent}>
                <h3 className={styles.title}>Detalhes do pagamento</h3>

                <div className={styles.infoRow}>
                    <span className={styles.label}>Usuário:</span>
                    <strong>{payment.user_name}</strong>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}>Referência:</span>
                    <span>
                        {payment.month.toString().padStart(2, "0")}/{payment.year}
                    </span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}>Valor:</span>
                    <span className={styles.amount}>{formatCurrency(payment.amount)}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}>Vencimento:</span>
                    <span>{formatDate(payment.due_date)}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.label}>Situação:</span>
                    <PaymentStatusBadge status={payment.payment_status} />
                </div>

                {payment.paid_at && (
                    <div className={styles.infoRow}>
                        <span className={styles.label}>Pago em:</span>
                        <span className={styles.paidDate}>{formatDate(payment.paid_at)}</span>
                    </div>
                )}

                {payment.receipt_url && (
                    <div className={styles.receiptArea}>
                        <button
                            type="button"
                            className={styles.viewReceiptButton}
                            onClick={handleViewReceipt}
                        >
                            Visualizar comprovante
                        </button>
                        <small className={styles.receiptHint}>
                            Clique para abrir o comprovante PDF (Mercado Pago)
                        </small>
                    </div>
                )}

                {!payment.receipt_url && payment.payment_status === "paid" && (
                    <div className={styles.warning}>
                        Comprovante não disponível. Entre em contato com o usuário.
                    </div>
                )}
            </div>
        </Modal>
    );
}