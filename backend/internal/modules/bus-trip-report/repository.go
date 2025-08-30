package bus_trip_report

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BusTripReportRepository struct {
	db *gorm.DB
}

func NewBusTripReportRepository(db *gorm.DB) *BusTripReportRepository {
	return &BusTripReportRepository{db}
}

func (repo *BusTripReportRepository) FindAll() ([]BusTripReport, error) {
	var busTripReports []BusTripReport
	err := repo.db.Find(&busTripReports).Error
	return busTripReports, err
}

func (repo *BusTripReportRepository) FindByID(id uuid.UUID) (*BusTripReport, error) {
	var busTripReport BusTripReport
	err := repo.db.First(&busTripReport, id).Error
	return &busTripReport, err
}

func (repo *BusTripReportRepository) FindByUserID(userID uuid.UUID) ([]BusTripReport, error) {
	var busTripReports []BusTripReport
	err := repo.db.Where("user_id = ?", userID).Find(&busTripReports).Error
	return busTripReports, err
}

func (repo *BusTripReportRepository) FindByDate(date time.Time) ([]BusTripReport, error) {
	var busTripReports []BusTripReport
	err := repo.db.Where("date = ?", date).Find(&busTripReports).Error
	return busTripReports, err
}

func (repo *BusTripReportRepository) FindByNextDate(date time.Time) ([]BusTripReport, error) {
	var busTripReport []BusTripReport
	err := repo.db.Where("date >= ?", date).Find(&busTripReport).Error
	return busTripReport, err
}

func (repo *BusTripReportRepository) FindByUserIDAndDate(userID uuid.UUID, date time.Time) ([]BusTripReport, error) {
	var busTripReport []BusTripReport
	err := repo.db.Where("user_id = ? AND date = ?", userID, date).Find(&busTripReport).Error
	return busTripReport, err
}

func (repo *BusTripReportRepository) FindByUserIDNextDate(userID uuid.UUID, date time.Time) ([]BusTripReport, error) {
	var busTripReport []BusTripReport
	err := repo.db.Where("user_id = ? AND date >= ?", userID, date).Find(&busTripReport).Error
	return busTripReport, err
}

func (repo *BusTripReportRepository) Create(busTripReport *BusTripReport) error {
	return repo.db.Create(busTripReport).Error
}

func (repo *BusTripReportRepository) Update(busTripReport *BusTripReport) error {
	return repo.db.Save(busTripReport).Error
}

func (repo *BusTripReportRepository) Delete(id uuid.UUID) error {
	return repo.db.Delete(&BusTripReport{}, id).Error
}
