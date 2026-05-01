package bus_trip

import (
	"errors"
	"net/http"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
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
		api.BadRequest(ctx, "formato de data inválido (esperado: AAAA-MM-DD)")
		return
	}

	busTrips, err := handler.service.FindByDate(date)
	if err != nil {
		api.InternalError(ctx, err)
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, busTrips)
}

func (handler *BusTripHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "ID da viagem em formato inválido")
		return
	}

	busTrip, err := handler.service.FindByID(id)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar viagem"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, busTrip)
}

func (handler *BusTripHandler) UpdateStatus(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "ID da viagem inválido")
		return
	}

	status := types.Status(ctx.Param("status"))
	if err := types.ValidateStatus(status); err != nil {
		api.BadRequest(ctx, "o status fornecido é inválido")
		return
	}

	if err := handler.service.UpdateStatus(id, status); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao atualizar status"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}
