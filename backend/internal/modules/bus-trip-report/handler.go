package bus_trip_report

import (
	"time"

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

	busTripReportsResponse := make([]BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *busTripReport.ToResponseDTO()
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

	ctx.JSON(200, busTripReport.ToResponseDTO())
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

	busTripReportsResponse := make([]BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *busTripReport.ToResponseDTO()
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

	busTripReportsResponse := make([]BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *busTripReport.ToResponseDTO()
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

	busTripReportsResponse := make([]BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *busTripReport.ToResponseDTO()
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

	busTripReportsResponse := make([]BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *busTripReport.ToResponseDTO()
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) FindByUserIDNextDate(ctx *gin.Context) {
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

	busTripReportsResponse := make([]BusTripReportResponseDTO, len(busTripReports))
	for i, busTripReport := range busTripReports {
		busTripReportsResponse[i] = *busTripReport.ToResponseDTO()
	}

	ctx.JSON(200, busTripReportsResponse)
}

func (handler *BusTripReportHandler) Create(ctx *gin.Context) {
	var busTripReportRequest BusTripReportRequestDTO
	if err := ctx.ShouldBindJSON(&busTripReportRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := busTripReportRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	busTripReport := busTripReportRequest.ToEntity()
	if err := handler.service.Create(busTripReport); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, busTripReport.ToResponseDTO())
}

func (handler *BusTripReportHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var busTripReportRequest BusTripReportRequestDTO
	if err := ctx.ShouldBindJSON(&busTripReportRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := busTripReportRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	busTripReport := busTripReportRequest.ToEntity()
	busTripReport.ID = id
	if err := handler.service.Update(busTripReport); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, busTripReport.ToResponseDTO())
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
