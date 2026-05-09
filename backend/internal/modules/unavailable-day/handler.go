package unavailable_day

import (
	"errors"
	"net/http"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
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
		api.InternalError(ctx, errors.New("erro interno ao buscar dias indisponíveis"))
		return
	}

	unavailableDaysResponse := make([]dtos.UnavailableDayResponseDTO, len(unavailableDays))
	for i, unavailableDay := range unavailableDays {
		unavailableDaysResponse[i] = *dtos.ToUnavailableDayResponseDTO(&unavailableDay)
	}

	api.RespondWithSuccess(ctx, http.StatusOK, unavailableDaysResponse)
}

func (handler *UnavailableDayHandler) Create(ctx *gin.Context) {
	var unavailableDayRequest dtos.UnavailableDayRequestDTO
	if err := ctx.ShouldBindJSON(&unavailableDayRequest); err != nil {
		api.BadRequest(ctx, "corpo da requisição inválido")
		return
	}

	if err := unavailableDayRequest.Validate(); err != nil {
		api.BadRequest(ctx, err.Error())
		return
	}

	unavailableDay := unavailableDayRequest.ToEntity()
	if err := handler.service.Create(unavailableDay); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao criar dia indisponível"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusCreated, dtos.ToUnavailableDayResponseDTO(unavailableDay))
}

func (handler *UnavailableDayHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "ID em formato inválido")
		return
	}

	if err := handler.service.Delete(id); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao deletar dia indisponível"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}
