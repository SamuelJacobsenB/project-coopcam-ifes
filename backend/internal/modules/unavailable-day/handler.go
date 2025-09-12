package unavailable_day

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UnavailableDayHandler struct {
	service *UnavailableDayService
}

func NewUnavailableDayHandler(service *UnavailableDayService) *UnavailableDayHandler {
	return &UnavailableDayHandler{service}
}

func (handler *UnavailableDayHandler) FindAll(ctx *gin.Context) {
	unavailableDays, err := handler.service.FindAll()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	unavailableDaysResponse := make([]dtos.UnavailableDayResponseDTO, len(unavailableDays))
	for i, unavailableDay := range unavailableDays {
		unavailableDaysResponse[i] = *dtos.ToUnavailableDayResponseDTO(&unavailableDay)
	}

	ctx.JSON(200, unavailableDaysResponse)
}

func (handler *UnavailableDayHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	unavailableDay, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToUnavailableDayResponseDTO(unavailableDay))
}

func (handler *UnavailableDayHandler) Create(ctx *gin.Context) {
	var unavailableDayRequest dtos.UnavailableDayRequestDTO
	if err := ctx.ShouldBindJSON(&unavailableDayRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := unavailableDayRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	unavailableDay := unavailableDayRequest.ToEntity()
	if err := handler.service.Create(unavailableDay); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, dtos.ToUnavailableDayResponseDTO(unavailableDay))
}

func (handler *UnavailableDayHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var unavailableDayRequest dtos.UnavailableDayRequestDTO
	if err := ctx.ShouldBindJSON(&unavailableDayRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := unavailableDayRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	unavailableDay := unavailableDayRequest.ToEntity()
	unavailableDay.ID = id
	if err := handler.service.Update(unavailableDay); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToUnavailableDayResponseDTO(unavailableDay))
}

func (handler *UnavailableDayHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.Delete(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(204, nil)
}

