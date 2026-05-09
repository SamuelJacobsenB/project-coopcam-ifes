package template

import (
	"errors"
	"net/http"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
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
		api.BadRequest(ctx, "id de usuário no contexto inválido")
		return
	}

	template, err := handler.service.FindByUserID(id)
	if err != nil {
		api.NotFound(ctx, "template não encontrado para este usuário")
		return
	}

	//
	api.RespondWithSuccess(ctx, http.StatusOK, dtos.ToTemplateResponseDTO(template))
}

func (handler *TemplateHandler) Create(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		api.BadRequest(ctx, "id de usuário inválido")
		return
	}

	var templateRequest dtos.TemplateRequestDTO
	if err := ctx.ShouldBindJSON(&templateRequest); err != nil {
		api.BadRequest(ctx, "corpo da requisição inválido")
		return
	}

	if err := templateRequest.Validate(); err != nil {
		api.BadRequest(ctx, err.Error())
		return
	}

	template := templateRequest.ToEntity()
	template.UserID = userID
	if err := handler.service.Create(template); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao criar template"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusCreated, dtos.ToTemplateResponseDTO(template))
}

func (handler *TemplateHandler) Update(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		api.BadRequest(ctx, "id de usuário inválido")
		return
	}

	var templateRequest dtos.TemplateRequestDTO
	if err := ctx.ShouldBindJSON(&templateRequest); err != nil {
		api.BadRequest(ctx, "dados fornecidos são inválidos")
		return
	}

	if err := templateRequest.Validate(); err != nil {
		api.BadRequest(ctx, "validação do template falhou")
		return
	}

	template := templateRequest.ToEntity()
	template.UserID = userID
	if err := handler.service.Update(template); err != nil {
		api.InternalError(ctx, errors.New("erro ao atualizar template"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, dtos.ToTemplateResponseDTO(template))
}

func (handler *TemplateHandler) DeleteByUserID(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		api.BadRequest(ctx, "id de usuário inválido")
		return
	}

	if err := handler.service.DeleteByUserID(userID); err != nil {
		api.InternalError(ctx, errors.New("erro ao deletar template"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}
