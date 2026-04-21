package bus_trip

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
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

func (handler *BusTripHandler) FindAll(ctx *gin.Context) {
	busTrips, err := handler.service.FindAll()
	if err != nil {
		ctx.AbortWithStatusJSON(500, "erro ao buscar viagens")
		return
	}

	ctx.JSON(200, busTrips)
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

func (handler *BusTripHandler) FindByNextDate(ctx *gin.Context) {
	date, err := time.Parse("2006-01-02", ctx.Param("date"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "data inválida"})
		return
	}

	busTrips, err := handler.service.FindByNextDate(date)
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

func (handler *BusTripHandler) Create(ctx *gin.Context) {
	var busTripRequest dtos.BusTripRequestDTO
	if err := ctx.ShouldBindJSON(&busTripRequest); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	if err := busTripRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	busTrip := busTripRequest.ToEntity()
	if err := handler.service.Create(busTrip); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao criar viagem"})
		return
	}

	ctx.JSON(201, dtos.ToBusTripResponseDTO(busTrip))
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

func (handler *BusTripHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.Delete(id); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao deletar viagem"})
		return
	}

	ctx.JSON(204, nil)
}
