package monthly_payment

import (
	"context"
	"fmt"
	"net/http"
	"strconv"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type MonthlyPaymentHandler struct {
	service *MonthlyPaymentService
}

func NewMonthlyPaymentHandler(service *MonthlyPaymentService) *MonthlyPaymentHandler {
	return &MonthlyPaymentHandler{service}
}

func (h *MonthlyPaymentHandler) FindByUser(ctx *gin.Context) {
	targetUserID, err := uuid.Parse(ctx.Param("user_id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "user_id inválido"})
		return
	}

	loggedUserIDStr, exists := ctx.Get("user_id")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}
	loggedUserID, err := uuid.Parse(loggedUserIDStr.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "erro interno"})
		return
	}

	role, exists := ctx.Get("user_role")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "não autorizado"})
		return
	}
	userRole := role.(string)

	if userRole != types.RoleAdmin && userRole != types.RoleCoordinator && loggedUserID != targetUserID {
		ctx.JSON(http.StatusForbidden, gin.H{"error": "você não tem permissão para ver pagamentos de outro usuário"})
		return
	}

	payments, err := h.service.FindByUser(targetUserID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, dtos.ToMonthlyPaymentListResponse(payments))
}

func (h *MonthlyPaymentHandler) ListByPeriod(ctx *gin.Context) {
	year, err := strconv.Atoi(ctx.Param("year"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ano inválido"})
		return
	}

	month, err := strconv.Atoi(ctx.Param("month"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "mês inválido"})
		return
	}

	payments, err := h.service.ListByPeriodLight(month, year)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, dtos.ToMonthlyPaymentListResponse(payments))
}

func (h *MonthlyPaymentHandler) EmitBatch(ctx *gin.Context) {
	var req struct {
		Month int `json:"month" binding:"required"`
		Year  int `json:"year" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Mês e ano são obrigatórios"})
		return
	}

	err := h.service.EmitBatch(ctx.Request.Context(), req.Month, req.Year)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Processamento de lote iniciado com sucesso"})
}

func (h *MonthlyPaymentHandler) UpdateStatus(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "id inválido"})
		return
	}

	var req struct {
		Status types.PaymentStatus `json:"status" binding:"required"`
	}
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := h.service.UpdateStatus(id, req.Status); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusNoContent)
}

func (h *MonthlyPaymentHandler) HandleWebhook(ctx *gin.Context) {
	var notification struct {
		Action string `json:"action"`
		Type   string `json:"type"`
		Data   struct {
			ID string `json:"id"`
		} `json:"data"`
	}

	if err := ctx.ShouldBindJSON(&notification); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "payload inválido"})
		return
	}

	// Sempre responda 200 OK para o Mercado Pago rapidamente
	ctx.Status(http.StatusOK)

	isRelevantAction := notification.Action == "payment.updated" || notification.Action == "payment.created"
	isPaymentType := notification.Type == "payment"

	if isRelevantAction || isPaymentType {
		externalID := notification.Data.ID

		// Rodar em background para não prender a resposta ao Mercado Pago
		go func(id string) {
			// Cria um contexto vazio pois o ctx do Gin será cancelado ao retornar a resposta
			bgCtx := context.Background()
			err := h.service.ProcessWebhook(bgCtx, id)
			if err != nil {
				fmt.Printf("Erro ao processar webhook (external_id=%s): %v\n", id, err)
			}
		}(externalID)
	}
}
