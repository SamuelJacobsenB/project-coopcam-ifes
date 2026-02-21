package monthly_fee_config

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type MonthlyFeeConfigHandler struct {
	service *MonthlyFeeConfigService
}

func NewMonthlyFeeConfigHandler(service *MonthlyFeeConfigService) *MonthlyFeeConfigHandler {
	return &MonthlyFeeConfigHandler{service}
}

func (h *MonthlyFeeConfigHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	config, err := h.service.FindByID(id)
	if err != nil {
		ctx.JSON(404, gin.H{"error": "configuração não encontrada"})
		return
	}

	ctx.JSON(200, dtos.ToMonthlyFeeConfigResponseDTO(config))
}

func (h *MonthlyFeeConfigHandler) Create(ctx *gin.Context) {
	var configRequest dtos.MonthlyFeeConfigRequestDTO
	if err := ctx.ShouldBindJSON(&configRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := configRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	config := configRequest.ToEntity()
	if err := h.service.CreateConfigAndDrafts(config); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, dtos.ToMonthlyFeeConfigResponseDTO(config))
}

func (h *MonthlyFeeConfigHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := h.service.DeleteConfigAndDrafts(id); err != nil {
		// Se o erro for de "irreversível", retorna 409 Conflict. Se for outro, 500.
		if err.Error() == "irreversível: não é possível deletar a configuração pois já existem cobranças emitidas no gateway para este mês" {
			ctx.JSON(409, gin.H{"error": err.Error()})
			return
		}
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(204)
}
