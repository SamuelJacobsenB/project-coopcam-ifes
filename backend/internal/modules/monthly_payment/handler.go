package monthly_payment

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type MonthlyPaymentHandler struct {
	service *MonthlyPaymentService
}

func NewMonthlyPaymentHandler(service *MonthlyPaymentService) *MonthlyPaymentHandler {
	return &MonthlyPaymentHandler{service}
}

// Criar uma cobrança (Admin)
func (handler *MonthlyPaymentHandler) Create(ctx *gin.Context) {
	var req dtos.MonthlyPaymentRequestDTO
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := req.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	payment := req.ToEntity()
	if err := handler.service.Create(payment); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, dtos.ToMonthlyPaymentResponseDTO(payment))
}

// Listar pagamentos de um usuário (Admin visualizando um user ou o próprio user)
func (handler *MonthlyPaymentHandler) FindByUser(ctx *gin.Context) {
	// Tenta pegar do parametro da URL (rota admin: /users/:id/payments)
	paramID := ctx.Param("user_id")

	// Se não tiver parametro, tenta pegar do token (rota user: /payments/my)
	if paramID == "" {
		paramID = ctx.GetString("user_id")
	}

	userID, err := uuid.Parse(paramID)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id de usuário inválido"})
		return
	}

	payments, err := handler.service.FindByUserID(userID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	response := make([]dtos.MonthlyPaymentResponseDTO, len(payments))
	for i, p := range payments {
		response[i] = *dtos.ToMonthlyPaymentResponseDTO(&p)
	}

	ctx.JSON(200, response)
}

// Atualizar status de pagamento (Admin)
func (handler *MonthlyPaymentHandler) UpdateStatus(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id de pagamento inválido"})
		return
	}

	var req dtos.MonthlyPaymentUpdateDTO
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := handler.service.TogglePaymentStatus(id, req.IsPaid); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	// Busca o objeto atualizado para retornar
	updatedPayment, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(200, gin.H{"message": "status atualizado", "warning": "erro ao buscar objeto atualizado"})
		return
	}

	ctx.JSON(200, dtos.ToMonthlyPaymentResponseDTO(updatedPayment))
}
