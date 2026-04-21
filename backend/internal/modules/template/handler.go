package template

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TemplateHandler struct {
	service *TemplateService
}

func NewTemplateHandler(service *TemplateService) *TemplateHandler {
	return &TemplateHandler{service}
}

func (handler *TemplateHandler) FindByUserID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "Id inválido"})
		return
	}

	template, err := handler.service.FindByUserID(id)
	if err != nil {
		ctx.JSON(404, gin.H{"error": "Template não encontrado"})
		return
	}

	ctx.JSON(200, dtos.ToTemplateResponseDTO(template))
}

func (handler *TemplateHandler) Create(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var templateRequest dtos.TemplateRequestDTO
	if err := ctx.ShouldBindJSON(&templateRequest); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	if err := templateRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	template := templateRequest.ToEntity()
	template.UserID = userID
	if err := handler.service.Create(template); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao criar template"})
		return
	}

	ctx.JSON(201, dtos.ToTemplateResponseDTO(template))
}

func (handler *TemplateHandler) Update(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var templateRequest dtos.TemplateRequestDTO
	if err := ctx.ShouldBindJSON(&templateRequest); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	if err := templateRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": "dados inválidos"})
		return
	}

	template := templateRequest.ToEntity()
	template.UserID = userID
	if err := handler.service.Update(template); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao atualizar template"})
		return
	}

	ctx.JSON(200, dtos.ToTemplateResponseDTO(template))
}

func (handler *TemplateHandler) DeleteByUserID(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.DeleteByUserID(userID); err != nil {
		ctx.JSON(500, gin.H{"error": "erro ao deletar template"})
		return
	}

	ctx.JSON(204, nil)
}
