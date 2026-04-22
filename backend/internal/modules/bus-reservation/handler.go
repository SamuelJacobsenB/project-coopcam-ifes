package bus_reservation

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BusReservationHandler struct {
	service *BusReservationService
}

func NewBusReservationHandler(service *BusReservationService) *BusReservationHandler {
	return &BusReservationHandler{service}
}

func (handler *BusReservationHandler) FindByDate(ctx *gin.Context) {
	date, err := time.Parse("02-01-2006", ctx.Param("date"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "data inválida"})
		return
	}

	busReservations, err := handler.service.FindByDate(date)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao buscar reservas"})
		return
	}

	busReservationsResponse := make([]dtos.BusReservationResponseDTO, len(busReservations))
	for i, busReservation := range busReservations {
		busReservationsResponse[i] = *dtos.ToBusReservationResponseDTO(&busReservation)
	}

	ctx.JSON(200, busReservationsResponse)
}

func (handler *BusReservationHandler) FindByTripID(ctx *gin.Context) {
	tripID, err := uuid.Parse(ctx.Param("trip_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	busReservations, err := handler.service.FindByTripID(tripID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao buscar reservas"})
		return
	}

	busReservationsResponse := make([]dtos.BusReservationResponseDTO, len(busReservations))
	for i, busReservation := range busReservations {
		busReservationsResponse[i] = *dtos.ToBusReservationResponseDTO(&busReservation)
	}

	ctx.JSON(200, busReservationsResponse)
}

func (handler *BusReservationHandler) Create(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var busReservationRequest dtos.BusReservationRequestDTO
	if err := ctx.ShouldBindJSON(&busReservationRequest); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	if err := busReservationRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	busReservation := busReservationRequest.ToEntity()
	busReservation.UserID = userID
	if err := handler.service.Create(busReservation); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao criar reserva"})
		return
	}

	ctx.JSON(201, dtos.ToBusReservationResponseDTO(busReservation))
}

func (handler *BusReservationHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.Delete(id, userID); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao deletar reserva"})
		return
	}

	ctx.JSON(204, nil)
}
