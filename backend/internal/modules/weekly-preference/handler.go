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
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	weeklyPreference, err := handler.service.FindByUserID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToWeeklyPreferenceResponseDTO(weeklyPreference))
}

func (handler *WeeklyPreferenceHandler) Create(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var weeklyPreferenceRequest dtos.WeeklyPreferenceRequestDTO
	if err := ctx.ShouldBindJSON(&weeklyPreferenceRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := weeklyPreferenceRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	weeklyPreference := weeklyPreferenceRequest.ToEntity()
	weeklyPreference.UserID = userID
	if err := handler.service.Create(weeklyPreference); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, dtos.ToWeeklyPreferenceResponseDTO(weeklyPreference))
}

func (handler *WeeklyPreferenceHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var weeklyPreferenceRequest dtos.WeeklyPreferenceRequestDTO
	if err := ctx.ShouldBindJSON(&weeklyPreferenceRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := weeklyPreferenceRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	weeklyPreference := weeklyPreferenceRequest.ToEntity()
	weeklyPreference.ID = id
	weeklyPreference.UserID = userID
	if err := handler.service.Update(weeklyPreference); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToWeeklyPreferenceResponseDTO(weeklyPreference))
}

func (handler *WeeklyPreferenceHandler) Delete(ctx *gin.Context) {
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

