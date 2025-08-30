package available_override

import (
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
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	availableOverridesResponse := make([]AvailableOverrideResponseDTO, len(availableOverrides))
	for i, availableOverride := range availableOverrides {
		availableOverridesResponse[i] = *availableOverride.ToResponseDTO()
	}

	ctx.JSON(200, availableOverridesResponse)
}

func (handler *AvailableOverrideHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	availableOverride, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, availableOverride.ToResponseDTO())
}

func (handler *AvailableOverrideHandler) Create(ctx *gin.Context) {
	var availableOverrideRequest AvailableOverrideRequestDTO
	if err := ctx.ShouldBindJSON(&availableOverrideRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := availableOverrideRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	availableOverride := availableOverrideRequest.ToEntity()
	if err := handler.service.Create(availableOverride); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, availableOverride.ToResponseDTO())
}

func (handler *AvailableOverrideHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var availableOverrideRequest AvailableOverrideRequestDTO
	if err := ctx.ShouldBindJSON(&availableOverrideRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := availableOverrideRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	availableOverride := availableOverrideRequest.ToEntity()
	availableOverride.ID = id
	if err := handler.service.Update(availableOverride); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, availableOverride.ToResponseDTO())
}

func (handler *AvailableOverrideHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.Delete(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(204, nil)
}
