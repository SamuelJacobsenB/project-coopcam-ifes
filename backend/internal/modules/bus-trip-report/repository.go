package bus_trip_report

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BusTripReportRepository struct {
	db *gorm.DB
}

func NewBusTripReportRepository(db *gorm.DB) *BusTripReportRepository {
	return &BusTripReportRepository{db}
}

func (repo *BusTripReportRepository) FindAll() ([]entities.BusTripReport, error) {
	var busTripReports []entities.BusTripReport
	err := repo.db.Find(&busTripReports).Error
	return busTripReports, err
}

func (repo *BusTripReportRepository) FindByID(id uuid.UUID) (*entities.BusTripReport, error) {
	var busTripReport entities.BusTripReport
	err := repo.db.First(&busTripReport, id).Error
	return &busTripReport, err
}

func (repo *BusTripReportRepository) FindByUserID(userID uuid.UUID) ([]entities.BusTripReport, error) {
	var busTripReports []entities.BusTripReport
	err := repo.db.Where("user_id = ?", userID).Find(&busTripReports).Error
	return busTripReports, err
}

func (repo *BusTripReportRepository) FindByDate(date time.Time) ([]entities.BusTripReport, error) {
	var busTripReports []entities.BusTripReport
	err := repo.db.Where("date = ?", date).Find(&busTripReports).Error
	return busTripReports, err
}

func (repo *BusTripReportRepository) FindByUserIDAndDateAndPeriod(userID uuid.UUID, date time.Time, period types.Period) ([]entities.BusTripReport, error) {
	var busTripReport []entities.BusTripReport
	err := repo.db.Where("user_id = ? AND date = ? AND period = ?", userID, date, period).First(&busTripReport).Error
	return busTripReport, err
}

func (repo *BusTripReportRepository) FindByNextDate(date time.Time) ([]entities.BusTripReport, error) {
	var busTripReport []entities.BusTripReport
	err := repo.db.Where("date >= ?", date).Find(&busTripReport).Error
	return busTripReport, err
}

func (repo *BusTripReportRepository) FindByUserIDAndDate(userID uuid.UUID, date time.Time) ([]entities.BusTripReport, error) {
	var busTripReport []entities.BusTripReport
	err := repo.db.Where("user_id = ? AND date = ?", userID, date).Find(&busTripReport).Error
	return busTripReport, err
}

func (repo *BusTripReportRepository) FindByUserIDNextDate(userID uuid.UUID, date time.Time) ([]entities.BusTripReport, error) {
	var busTripReport []entities.BusTripReport
	err := repo.db.Where("user_id = ? AND date >= ?", userID, date).Find(&busTripReport).Error
	return busTripReport, err
}

func (repo *BusTripReportRepository) Create(busTripReport *entities.BusTripReport) error {
	return repo.db.Create(busTripReport).Error
}

func (repo *BusTripReportRepository) Update(busTripReport *entities.BusTripReport) error {
	return repo.db.Where("id = ? AND user_id = ?", busTripReport.ID, busTripReport.UserID).Save(busTripReport).Error
}

func (repo *BusTripReportRepository) Delete(id uuid.UUID) error {
	return repo.db.Delete(&entities.BusTripReport{}, id).Error
}

