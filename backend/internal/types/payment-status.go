package types

type PaymentStatus string

const (
	PaymentDraft    PaymentStatus = "draft"    // Aguardando gateway
	PaymentPending  PaymentStatus = "pending"  // Criado, aguardando pagamento
	PaymentPaid     PaymentStatus = "paid"     // Confirmado
	PaymentOverdue  PaymentStatus = "overdue"  // Vencido
	PaymentCanceled PaymentStatus = "canceled" // Cancelado manualmente ou por erro
	PaymentFailed   PaymentStatus = "failed"   // Falha no pagamento
	PaymentRefunded PaymentStatus = "refunded" // Valor devolvido ao usuário
)
