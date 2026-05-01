package weekly_preference

import (
	"errors"
	"net/http"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type WeeklyPreferenceHandler struct {
	service *WeeklyPreferenceService
}

func NewWeeklyPreferenceHandler(service *WeeklyPreferenceService) *WeeklyPreferenceHandler {
	return &WeeklyPreferenceHandler{service}
}

func (handler *WeeklyPreferenceHandler) FindByUserID(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		api.BadRequest(ctx, "id de usuário inválido")
		return
	}

	weeklyPreference, err := handler.service.FindByUserID(userID)
	if err != nil {
		api.InternalError(ctx, errors.New("erro ao buscar preferência semanal"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, dtos.ToWeeklyPreferenceResponseDTO(weeklyPreference))
}
