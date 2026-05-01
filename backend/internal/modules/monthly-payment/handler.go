package monthly_payment

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/audit"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/payment"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type MonthlyPaymentHandler struct {
	service *MonthlyPaymentService
	logger  *audit.AuditLogger
}

func NewMonthlyPaymentHandler(service *MonthlyPaymentService, logger *audit.AuditLogger) *MonthlyPaymentHandler {
	return &MonthlyPaymentHandler{service, logger}
}

func (h *MonthlyPaymentHandler) FindByUser(ctx *gin.Context) {
	targetUserID, err := uuid.Parse(ctx.Param("user_id"))
	if err != nil {
		api.BadRequest(ctx, "user_id inválido")
		return
	}

	loggedUserIDStr, exists := ctx.Get("user_id")
	if !exists {
		api.Unauthorized(ctx, "sessão inválida")
		return
	}
	loggedUserID, err := uuid.Parse(loggedUserIDStr.(string))
	if err != nil {
		api.InternalError(ctx, err)
		return
	}

	role, exists := ctx.Get("user_role")
	if !exists {
		api.Unauthorized(ctx, "perfil de usuário não encontrado")
		return
	}
	userRole := role.(string)

	if userRole != types.RoleAdmin && userRole != types.RoleDriver && loggedUserID != targetUserID {
		api.Forbidden(ctx, "você não tem permissão para ver pagamentos de outro usuário")
		return
	}

	payments, err := h.service.FindByUser(targetUserID)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar pagamentos"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, dtos.ToMonthlyPaymentListResponse(payments))
}

func (h *MonthlyPaymentHandler) ListByPeriod(ctx *gin.Context) {
	year, err := strconv.Atoi(ctx.Param("year"))
	if err != nil {
		api.BadRequest(ctx, "ano inválido")
		return
	}

	month, err := strconv.Atoi(ctx.Param("month"))
	if err != nil {
		api.BadRequest(ctx, "mês inválido")
		return
	}

	payments, err := h.service.ListByPeriodLight(month, year)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar pagamentos"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, dtos.ToMonthlyPaymentListResponse(payments))
}

func (h *MonthlyPaymentHandler) EmitBatch(ctx *gin.Context) {
	var req struct {
		Month int `json:"month" binding:"required"`
		Year  int `json:"year" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		api.BadRequest(ctx, "mês e ano são obrigatórios para emissão em lote")
		return
	}

	err := h.service.EmitBatch(ctx.Request.Context(), req.Month, req.Year)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao emitir lote"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	h.logger.LogSensitiveAction(
		ctx.Request.Context(),
		"EMIT_PAYMENT_BATCH",
		"monthly_payment",
		fmt.Sprintf("Mês/Ano: %d/%d", req.Month, req.Year),
		adminID,
		ctx.ClientIP(),
	)

	api.RespondWithSuccess(ctx, http.StatusOK, map[string]string{
		"message": "processamento de lote iniciado com sucesso",
	})
}

func (h *MonthlyPaymentHandler) UpdateStatus(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id de pagamento inválido")
		return
	}

	var req struct {
		Status types.PaymentStatus `json:"status" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		api.BadRequest(ctx, "o novo status é obrigatório")
		return
	}

	if err := h.service.UpdateStatus(id, req.Status); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao atualizar status"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	h.logger.LogPaymentStatusChange(
		ctx.Request.Context(),
		id,
		"MANUAL_UPDATE",
		string(req.Status),
		adminID,
		ctx.ClientIP(),
	)

	api.RespondWithSuccess(ctx, http.StatusNoContent, nil)
}

func (h *MonthlyPaymentHandler) HandleWebhook(ctx *gin.Context) {
	signature := ctx.GetHeader("x-signature")
	requestID := ctx.GetHeader("x-request-id")
	secret := os.Getenv("MP_WEBHOOK_SECRET")

	// ✅ SEGURANÇA: Validar assinatura (incluindo timestamp)
	if !payment.ValidateMercadoPagoSignature(signature, requestID, secret) {
		api.Unauthorized(ctx, "assinatura do webhook inválida")
		return
	}

	var notification struct {
		Action string `json:"action"`
		Type   string `json:"type"`
		Data   struct {
			ID string `json:"id"`
		} `json:"data"`
	}

	if err := ctx.ShouldBindJSON(&notification); err != nil {
		api.BadRequest(ctx, "payload de notificação inválido")
		return
	}

	// ✅ SEGURANÇA: Validar que o externalID não é vazio
	if notification.Data.ID == "" {
		api.BadRequest(ctx, "external ID é obrigatório")
		return
	}

	// Respondemos 202 logo após validar a estrutura básica
	api.RespondWithSuccess(ctx, http.StatusAccepted, nil)

	if (notification.Action == "payment.updated" || notification.Action == "payment.created") || notification.Type == "payment" {
		externalID := notification.Data.ID
		go func(id string) {
			bgCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
			defer cancel()

			if err := h.service.ProcessWebhook(bgCtx, id); err != nil {
				log.Printf("[WEBHOOK_ERROR] Failed to process payment %s: %v", id, err)
			} else {
				h.logger.Log(bgCtx, &audit.AuditEvent{
					Action:    "WEBHOOK_PAYMENT_PROCESSED",
					Resource:  "monthly_payment",
					NewValue:  "External ID: " + id,
					Status:    "success",
					IPAddress: ctx.ClientIP(),
				})
			}
		}(externalID)
	}
}
