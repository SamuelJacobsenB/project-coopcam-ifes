package weekly_preference

import (
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

	ctx.JSON(200, weeklyPreference.ToResponseDTO())
}

func (handler *WeeklyPreferenceHandler) Create(ctx *gin.Context) {
	var weeklyPreferenceRequest WeeklyPreferenceRequestDTO
	if err := ctx.ShouldBindJSON(&weeklyPreferenceRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := weeklyPreferenceRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	weeklyPreference := weeklyPreferenceRequest.ToEntity()
	if err := handler.service.Create(weeklyPreference); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, weeklyPreference.ToResponseDTO())
}

func (handler *WeeklyPreferenceHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var weeklyPreferenceRequest WeeklyPreferenceRequestDTO
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
	if err := handler.service.Update(weeklyPreference); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, weeklyPreference.ToResponseDTO())
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
