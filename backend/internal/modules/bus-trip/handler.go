package bus_trip

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
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
		ctx.AbortWithStatusJSON(500, err.Error())
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
		ctx.AbortWithStatusJSON(500, err.Error())
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
		ctx.AbortWithStatusJSON(500, err.Error())
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
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, busTrip)
}

func (handler *BusTripHandler) Create(ctx *gin.Context) {
	var busTripRequest dtos.BusTripRequestDTO
	if err := ctx.ShouldBindJSON(&busTripRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := busTripRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	busTrip := busTripRequest.ToEntity()
	if err := handler.service.Create(busTrip); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, dtos.ToBusTripResponseDTO(busTrip))
}

func (handler *BusTripHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var busTripRequest dtos.BusTripUpdateDTO
	if err := ctx.ShouldBindJSON(&busTripRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := busTripRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	busTrip := busTripRequest.ToEntity()
	busTrip.ID = id
	if err := handler.service.Update(busTrip); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToBusTripResponseDTO(busTrip))
}

func (handler *BusTripHandler) Delete(ctx *gin.Context) {
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
