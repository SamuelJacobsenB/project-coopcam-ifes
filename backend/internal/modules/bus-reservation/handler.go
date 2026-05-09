package bus_reservation

import (
	"errors"
	"net/http"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
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
		api.BadRequest(ctx, "formato de data inválido (esperado: DD-MM-AAAA)")
		return
	}

	busReservations, err := handler.service.FindByDate(date)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar reservas"))
		return
	}

	busReservationsResponse := make([]dtos.BusReservationResponseDTO, len(busReservations))
	for i, busReservation := range busReservations {
		busReservationsResponse[i] = *dtos.ToBusReservationResponseDTO(&busReservation)
	}

	api.RespondWithSuccess(ctx, http.StatusOK, busReservationsResponse)
}

func (handler *BusReservationHandler) FindByTripID(ctx *gin.Context) {
	tripID, err := uuid.Parse(ctx.Param("trip_id"))
	if err != nil {
		api.BadRequest(ctx, "id da viagem em formato inválido")
		return
	}

	busReservations, err := handler.service.FindByTripID(tripID)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar reservas"))
		return
	}

	busReservationsResponse := make([]dtos.BusReservationResponseDTO, len(busReservations))
	for i, busReservation := range busReservations {
		busReservationsResponse[i] = *dtos.ToBusReservationResponseDTO(&busReservation)
	}

	api.RespondWithSuccess(ctx, http.StatusOK, busReservationsResponse)
}

func (handler *BusReservationHandler) Create(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		api.Unauthorized(ctx, "usuário não identificado")
		return
	}

	var busReservationRequest dtos.BusReservationRequestDTO
	if err := ctx.ShouldBindJSON(&busReservationRequest); err != nil {
		api.BadRequest(ctx, "dados da reserva inválidos")
		return
	}

	if err := busReservationRequest.Validate(); err != nil {
		api.BadRequest(ctx, "erro na validação dos campos")
		return
	}

	busReservation := busReservationRequest.ToEntity()
	busReservation.UserID = userID
	if err := handler.service.Create(busReservation); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao criar reserva"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusCreated, dtos.ToBusReservationResponseDTO(busReservation))
}

func (handler *BusReservationHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id da reserva inválido")
		return
	}

	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		api.Unauthorized(ctx, "usuário não identificado")
		return
	}

	if err := handler.service.Delete(id, userID); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao deletar reserva"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}
