package bus_trip

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BusTripHandler struct {
	service *BusTripService
}

func NewBusTripHandler(service *BusTripService) *BusTripHandler {
	return &BusTripHandler{service}
}

func (handler *BusTripHandler) FindByDate(ctx *gin.Context) {
	date, err := time.Parse("2006-01-02", ctx.Param("date"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "data inválida"})
		return
	}

	busTrips, err := handler.service.FindByDate(date)
	if err != nil {
		ctx.AbortWithStatusJSON(500, "erro ao buscar viagens")
		return
	}

	ctx.JSON(200, busTrips)

}

func (handler *BusTripHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	busTrip, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao buscar viagem"})
		return
	}

	ctx.JSON(200, busTrip)
}

func (handler *BusTripHandler) UpdateStatus(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	status := types.Status(ctx.Param("status"))
	if err := types.ValidateStatus(status); err != nil {
		ctx.JSON(400, gin.H{"error": "status inválido"})
		return
	}

	if err := handler.service.UpdateStatus(id, status); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao atualizar viagem"})
		return
	}

	ctx.JSON(200, nil)
}
