package bus_trip_report

import (
	"errors"
	"net/http"
	"strconv"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BusTripReportHandler struct {
	service *BusTripReportService
}

func NewBusTripReportHandler(service *BusTripReportService) *BusTripReportHandler {
	return &BusTripReportHandler{service}
}

func (handler *BusTripReportHandler) FindByDate(ctx *gin.Context) {
	date, err := time.Parse("02-01-2006", ctx.Param("date"))
	if err != nil {
		api.BadRequest(ctx, "formato de data inválido (esperado: DD-MM-AAAA)")
		return
	}

	busTripReports, err := handler.service.FindByDate(date)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar relatórios"))
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	api.RespondWithSuccess(ctx, http.StatusOK, busTripReportsResponse)
}

func (handler *BusTripReportHandler) FindByUserAndMonth(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.Param("user_id"))
	if err != nil {
		api.BadRequest(ctx, "id de usuário em formato inválido")
		return
	}

	monthStr := ctx.Param("month")
	month, err := strconv.Atoi(monthStr)
	if err != nil || month < 1 || month > 12 {
		api.BadRequest(ctx, "mês inválido (deve ser um número entre 1 e 12)")
		return
	}

	if month < 1 || month > 12 {
		api.BadRequest(ctx, "mês inválido (deve ser um número entre 1 e 12)")
		return
	}

	busTripReports, err := handler.service.FindByUserAndMonth(userID, month)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar relatórios"))
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	api.RespondWithSuccess(ctx, http.StatusOK, busTripReportsResponse)
}

func (handler *BusTripReportHandler) CreateMany(ctx *gin.Context) {
	tripID, err := uuid.Parse(ctx.Param("trip_id"))
	if err != nil {
		api.BadRequest(ctx, "id de viagem inválido")
		return
	}

	var userIDRequests []string
	if err := ctx.ShouldBindJSON(&userIDRequests); err != nil {
		api.BadRequest(ctx, "corpo da requisição deve ser uma lista de IDs")
		return
	}

	var userIDs []uuid.UUID
	for _, userIDRequest := range userIDRequests {
		userID, err := uuid.Parse(userIDRequest)
		if err != nil {
			api.BadRequest(ctx, "um dos IDs de usuário fornecidos é inválido: "+userIDRequest)
			return
		}
		userIDs = append(userIDs, userID)
	}

	if err := handler.service.CreateMany(tripID, userIDs); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao criar relatório"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusCreated, nil)
}
