package bus_trip_report

import (
	"strconv"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type BusTripReportHandler struct {
	service *BusTripReportService
}

func NewBusTripReportHandler(service *BusTripReportService) *BusTripReportHandler {
	return &BusTripReportHandler{service}
}

func (handler *BusTripReportHandler) FindAll(ctx *gin.Context) {
	busTripReports, err := handler.service.FindAll()
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	busTripReport, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToBusTripReportResponseDTO(busTripReport))
}

func (handler *BusTripReportHandler) FindByUserID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	busTripReports, err := handler.service.FindByUserID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) FindByDate(ctx *gin.Context) {
	date, err := time.Parse("02-01-2006", ctx.Param("date"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "data inválida"})
		return
	}

	busTripReports, err := handler.service.FindByDate(date)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) FindByNextDate(ctx *gin.Context) {
	date, err := time.Parse("02-01-2006", ctx.Param("date"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "data inválida"})
		return
	}

	busTripReports, err := handler.service.FindByNextDate(date)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) FindByUserIDAndDate(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	date, err := time.Parse("02-01-2006", ctx.Param("date"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "data inválida"})
		return
	}

	busTripReports, err := handler.service.FindByUserIDAndDate(id, date)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) FindByUserIDAndNextDate(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	date, err := time.Parse("02-01-2006", ctx.Param("date"))

	if err != nil {
		ctx.JSON(400, gin.H{"error": "data inválida"})
		return
	}

	busTripReports, err := handler.service.FindByUserIDNextDate(id, date)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) FindByUserAndMonth(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.Param("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "ID de usuário inválido"})
		return
	}

	monthStr := ctx.Param("month")
	month, err := strconv.Atoi(monthStr)
	if err != nil || month < 1 || month > 12 {
		ctx.JSON(400, gin.H{"error": "Mês inválido. Deve ser um número entre 1 e 12"})
		return
	}

	if !utils.ValidateMonth(month) {
		ctx.JSON(400, gin.H{"error": "Mês inválido. Deve ser um número entre 1 e 12"})
		return
	}

	busTripReports, err := handler.service.FindByUserAndMonth(userID, month)
	if err != nil {
		ctx.JSON(500, gin.H{"error": "Erro ao buscar relatórios: " + err.Error()})
		return
	}

	busTripReportsResponse := make([]dtos.BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *dtos.ToBusTripReportResponseDTO(&busTripReport)
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) CreateMany(ctx *gin.Context) {
	tripID, err := uuid.Parse(ctx.Param("trip_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id de viagem inválido"})
		return
	}

	var userIDRequests []string
	if err := ctx.ShouldBindJSON(&userIDRequests); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	var userIDs []uuid.UUID
	for _, userIDRequest := range userIDRequests {
		userID, err := uuid.Parse(userIDRequest)
		if err != nil {
			ctx.JSON(400, gin.H{"error": "ID de usuário inválido"})
			return
		}

		userIDs = append(userIDs, userID)
	}

	if err := handler.service.CreateMany(tripID, userIDs); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, nil)
}

func (handler *BusTripReportHandler) Delete(ctx *gin.Context) {
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
