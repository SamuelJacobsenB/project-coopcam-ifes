package available_override

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type AvailableOverrideHandler struct {
	service *AvailableOverrideService
}

func NewAvailableOverrideHandler(service *AvailableOverrideService) *AvailableOverrideHandler {
	return &AvailableOverrideHandler{service}
}

func (handler *AvailableOverrideHandler) FindAll(ctx *gin.Context) {
	availableOverrides, err := handler.service.FindAll()
	if err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao buscar dias disponíveis"})
		return
	}

	availableOverridesResponse := make([]dtos.AvailableOverrideResponseDTO, len(availableOverrides))
	for i, availableOverride := range availableOverrides {
		availableOverridesResponse[i] = *dtos.ToAvailableOverrideResponseDTO(&availableOverride)
	}

	ctx.JSON(200, availableOverridesResponse)
}

func (handler *AvailableOverrideHandler) Create(ctx *gin.Context) {
	var availableOverrideRequest dtos.AvailableOverrideRequestDTO
	if err := ctx.ShouldBindJSON(&availableOverrideRequest); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	if err := availableOverrideRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	availableOverride := availableOverrideRequest.ToEntity()
	if err := handler.service.Create(availableOverride); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao criar dia disponível"})
		return
	}

	ctx.JSON(201, dtos.ToAvailableOverrideResponseDTO(availableOverride))
}

func (handler *AvailableOverrideHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.Delete(id); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao deletar dia disponível"})
		return
	}

	ctx.JSON(204, nil)
}
