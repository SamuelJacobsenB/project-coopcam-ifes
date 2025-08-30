package template

import (
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
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	template, err := handler.service.FindByUserID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, template.ToResponseDTO())
}

func (handler *TemplateHandler) Create(ctx *gin.Context) {
	var templateRequest TemplateRequestDTO
	if err := ctx.ShouldBindJSON(&templateRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := templateRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	template := templateRequest.ToEntity()
	if err := handler.service.Create(template); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, template.ToResponseDTO())
}

func (handler *TemplateHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var templateRequest TemplateRequestDTO
	if err := ctx.ShouldBindJSON(&templateRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := templateRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	template := templateRequest.ToEntity()
	template.ID = id
	if err := handler.service.Update(template); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, template.ToResponseDTO())
}

func (handler *TemplateHandler) Delete(ctx *gin.Context) {
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
