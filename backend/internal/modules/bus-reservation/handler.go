package bus_reservation

import (
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BusReservationHandler struct {
	service *BusReservationService
}

func NewBusReservationHandler(service *BusReservationService) *BusReservationHandler {
	return &BusReservationHandler{service}
}

func (handler *BusReservationHandler) FindAll(ctx *gin.Context) {
	busReservations, err := handler.service.FindAll()

	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busReservationsResponse := make([]BusReservationResponseDTO, len(busReservations))
	for i, busReservation := range busReservations {
		busReservationsResponse[i] = *busReservation.ToResponseDTO()
	}

	ctx.JSON(200, busReservationsResponse)
}

func (handler *BusReservationHandler) FindByDate(ctx *gin.Context) {
	date, err := time.Parse("02-01-2006", ctx.Param("date"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "data inválida"})
		return
	}

	busReservations, err := handler.service.FindByDate(date)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busReservationsResponse := make([]BusReservationResponseDTO, len(busReservations))
	for i, busReservation := range busReservations {
		busReservationsResponse[i] = *busReservation.ToResponseDTO()
	}
}

func (handler *BusReservationHandler) FindByUserID(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	busReservations, err := handler.service.FindByUserID(userID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busReservationsResponse := make([]BusReservationResponseDTO, len(busReservations))
	for i, busReservation := range busReservations {
		busReservationsResponse[i] = *busReservation.ToResponseDTO()
	}

	ctx.JSON(200, busReservationsResponse)
}

func (handler *BusReservationHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	busReservation, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, busReservation.ToResponseDTO())
}

func (handler *BusReservationHandler) Create(ctx *gin.Context) {
	var busReservationRequest BusReservationRequestDTO
	if err := ctx.ShouldBindJSON(&busReservationRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := busReservationRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	busReservation := busReservationRequest.ToEntity()
	if err := handler.service.Create(busReservation); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, busReservation.ToResponseDTO())
}

func (handler *BusReservationHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var busReservationRequest BusReservationRequestDTO
	if err := ctx.ShouldBindJSON(&busReservationRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := busReservationRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	busReservation := busReservationRequest.ToEntity()
	busReservation.ID = id
	if err := handler.service.Update(busReservation); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, busReservation.ToResponseDTO())
}

func (handler *BusReservationHandler) Delete(ctx *gin.Context) {
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
