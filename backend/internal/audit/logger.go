package audit

import (
	"context"
	"log"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AuditEvent struct {
	ID        uuid.UUID `gorm:"type:uuid;primaryKey"`
	UserID    uuid.UUID `gorm:"type:uuid;index"`
	Action    string    `gorm:"index"` // LOGIN_SUCCESS, PROMOTE_ADMIN, etc
	Resource  string    // "user", "payment", "bus_trip"
	OldValue  string    `gorm:"type:text"`
	NewValue  string    `gorm:"type:text"`
	IPAddress string
	Status    string // "success", "failure"
	ErrorMsg  string
	CreatedAt time.Time
}

type AuditLogger struct {
	db *gorm.DB
}

func NewAuditLogger(db *gorm.DB) *AuditLogger {
	return &AuditLogger{db: db}
}

func (al *AuditLogger) Log(ctx context.Context, event *AuditEvent) {
	event.ID = uuid.New()
	event.CreatedAt = time.Now()

	if err := al.db.WithContext(ctx).Create(event).Error; err != nil {
		log.Printf("[AUDIT_LOG_ERROR] Failed to write audit: %v", err)
	}
}

func (al *AuditLogger) LogLoginAttempt(ctx context.Context, email, ipAddress string, success bool, errorMsg string) {
	status := "success"
	if !success {
		status = "failure"
	}

	al.Log(ctx, &AuditEvent{
		Action:    "LOGIN_ATTEMPT",
		Resource:  "auth",
		OldValue:  email,
		IPAddress: ipAddress,
		Status:    status,
		ErrorMsg:  errorMsg,
	})
}

func (al *AuditLogger) LogRoleChange(ctx context.Context, userID uuid.UUID, oldRole, newRole string, admin uuid.UUID) {
	al.Log(ctx, &AuditEvent{
		UserID:   admin,
		Action:   "ROLE_CHANGE",
		Resource: "user",
		OldValue: oldRole,
		NewValue: newRole,
		Status:   "success",
	})
}

func (al *AuditLogger) LogPaymentStatusChange(ctx context.Context, paymentID uuid.UUID, oldStatus, newStatus string, actorID uuid.UUID, ip string) {
	al.Log(ctx, &AuditEvent{
		UserID:    actorID,
		Action:    "PAYMENT_STATUS_CHANGE",
		Resource:  "monthly_payment",
		OldValue:  oldStatus,
		NewValue:  newStatus,
		IPAddress: ip,
		Status:    "success",
	})
}

func (al *AuditLogger) LogMonthlyFeeConfigChange(ctx context.Context, resource string, oldVal, newVal string, adminID uuid.UUID, ip string) {
	al.Log(ctx, &AuditEvent{
		UserID:    adminID,
		Action:    "MONTHLY_FEE_CONFIG_UPDATE",
		Resource:  resource,
		OldValue:  oldVal,
		NewValue:  newVal,
		IPAddress: ip,
		Status:    "success",
	})
}

func (al *AuditLogger) LogDeletion(ctx context.Context, resource string, resourceID string, adminID uuid.UUID, ip string) {
	al.Log(ctx, &AuditEvent{
		UserID:    adminID,
		Action:    "RESOURCE_DELETED",
		Resource:  resource,
		OldValue:  resourceID,
		IPAddress: ip,
		Status:    "success",
	})
}

func (al *AuditLogger) LogSensitiveAction(ctx context.Context, action, resource, details string, actorID uuid.UUID, ip string) {
	al.Log(ctx, &AuditEvent{
		UserID:    actorID,
		Action:    action,
		Resource:  resource,
		NewValue:  details,
		IPAddress: ip,
		Status:    "success",
	})
}
