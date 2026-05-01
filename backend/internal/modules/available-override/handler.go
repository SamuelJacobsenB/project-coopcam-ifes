package available_override

import (
	"errors"
	"net/http"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"

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
		api.InternalError(ctx, errors.New("erro ao buscar dias disponíveis"))
		return
	}

	availableOverridesResponse := make([]dtos.AvailableOverrideResponseDTO, len(availableOverrides))
	for i, availableOverride := range availableOverrides {
		availableOverridesResponse[i] = *dtos.ToAvailableOverrideResponseDTO(&availableOverride)
	}

	api.RespondWithSuccess(ctx, http.StatusOK, availableOverridesResponse)
}

func (handler *AvailableOverrideHandler) Create(ctx *gin.Context) {
	var availableOverrideRequest dtos.AvailableOverrideRequestDTO
	if err := ctx.ShouldBindJSON(&availableOverrideRequest); err != nil {
		api.BadRequest(ctx, "corpo da requisição inválido")
		return
	}

	if err := availableOverrideRequest.Validate(); err != nil {
		api.BadRequest(ctx, err.Error())
		return
	}

	availableOverride := availableOverrideRequest.ToEntity()
	if err := handler.service.Create(availableOverride); err != nil {
		api.InternalError(ctx, errors.New("erro ao criar disponibilidade diária"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusCreated, dtos.ToAvailableOverrideResponseDTO(availableOverride))
}

func (handler *AvailableOverrideHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id em formato inválido")
		return
	}

	if err := handler.service.Delete(id); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao deletar disponibilidade diária"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusNoContent, nil)
}
