package weekly_preference

import (
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
		ctx.JSON(401, gin.H{"error": "não autorizado"})
		return
	}

	weeklyPreference, err := handler.service.FindByUserID(userID)
	if err != nil {
		ctx.JSON(404, gin.H{"error": "preferência não encontrada"})
		return
	}

	ctx.JSON(200, dtos.ToWeeklyPreferenceResponseDTO(weeklyPreference))
}
