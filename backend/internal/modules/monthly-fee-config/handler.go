package monthly_fee_config

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/audit"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type MonthlyFeeConfigHandler struct {
	service *MonthlyFeeConfigService
	logger  *audit.AuditLogger
}

func NewMonthlyFeeConfigHandler(service *MonthlyFeeConfigService, logger *audit.AuditLogger) *MonthlyFeeConfigHandler {
	return &MonthlyFeeConfigHandler{service, logger}
}

func (h *MonthlyFeeConfigHandler) FindByYear(ctx *gin.Context) {
	yearStr := ctx.Param("year")
	year, err := strconv.Atoi(yearStr)
	if err != nil {
		api.BadRequest(ctx, "ano fornecido é inválido")
		return
	}

	configs, err := h.service.FindByYear(year)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar configurações"))
		return
	}

	response := make([]*dtos.MonthlyFeeConfigResponseDTO, len(configs))
	for i, c := range configs {
		response[i] = dtos.ToMonthlyFeeConfigResponseDTO(&c)
	}

	api.RespondWithSuccess(ctx, http.StatusOK, response)
}

func (h *MonthlyFeeConfigHandler) Create(ctx *gin.Context) {
	var configRequest dtos.MonthlyFeeConfigRequestDTO
	if err := ctx.ShouldBindJSON(&configRequest); err != nil {
		api.BadRequest(ctx, "corpo da requisição inválido")
		return
	}

	if err := configRequest.Validate(); err != nil {
		api.BadRequest(ctx, err.Error())
		return
	}

	config := configRequest.ToEntity()
	if err := h.service.CreateConfigAndDrafts(config); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao criar configuração"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	h.logger.LogMonthlyFeeConfigChange(
		ctx.Request.Context(),
		"monthly_fee_config",
		"NEW_RECORD",
		config.ID.String(),
		adminID,
		ctx.ClientIP(),
	)

	api.RespondWithSuccess(ctx, http.StatusCreated, dtos.ToMonthlyFeeConfigResponseDTO(config))
}

func (h *MonthlyFeeConfigHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "ID da configuração inválido")
		return
	}

	if err := h.service.DeleteConfigAndDrafts(id); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao deletar configuração"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	h.logger.LogDeletion(
		ctx.Request.Context(),
		"monthly_fee_config",
		id.String(),
		adminID,
		ctx.ClientIP(),
	)

	api.RespondWithSuccess(ctx, http.StatusNoContent, nil)
}
