package monthly_fee_config

import (
	"strconv"

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

func (h *MonthlyFeeConfigHandler) FindByYear(ctx *gin.Context) {
	yearStr := ctx.Param("year")
	year, err := strconv.Atoi(yearStr)
	if err != nil {
		ctx.JSON(400, gin.H{"error": "ano inválido"})
		return
	}

	configs, err := h.service.FindByYear(year)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao buscar configurações"})
		return
	}

	response := make([]*dtos.MonthlyFeeConfigResponseDTO, len(configs))
	for i, c := range configs {
		response[i] = dtos.ToMonthlyFeeConfigResponseDTO(&c)
	}

	ctx.JSON(200, response)
}

func (h *MonthlyFeeConfigHandler) Create(ctx *gin.Context) {
	var configRequest dtos.MonthlyFeeConfigRequestDTO
	if err := ctx.ShouldBindJSON(&configRequest); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	if err := configRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	config := configRequest.ToEntity()
	if err := h.service.CreateConfigAndDrafts(config); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao criar configuração"})
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
		ctx.JSON(500, gin.H{"error": "erro ao deletar configuração"})
		return
	}

	ctx.Status(204)
}
