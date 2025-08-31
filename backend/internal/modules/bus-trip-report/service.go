package bus_trip_report

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/entities"
	"github.com/google/uuid"
)

type BusTripReportService struct {
	repo *BusTripReportRepository
}

func NewBusTripReportService(repo *BusTripReportRepository) *BusTripReportService {
	return &BusTripReportService{repo}
}

func (service *BusTripReportService) FindAll() ([]entities.BusTripReport, error) {
	return service.repo.FindAll()
}

func (service *BusTripReportService) FindByID(id uuid.UUID) (*entities.BusTripReport, error) {
	return service.repo.FindByID(id)
}

func (service *BusTripReportService) FindByUserID(userID uuid.UUID) ([]entities.BusTripReport, error) {
	return service.repo.FindByUserID(userID)
}

func (service *BusTripReportService) FindByDate(date time.Time) ([]entities.BusTripReport, error) {
	return service.repo.FindByDate(date)
}

func (service *BusTripReportService) FindByNextDate(date time.Time) ([]entities.BusTripReport, error) {
	return service.repo.FindByNextDate(date)
}

func (service *BusTripReportService) FindByUserIDAndDate(userID uuid.UUID, date time.Time) ([]entities.BusTripReport, error) {
	return service.repo.FindByUserIDAndDate(userID, date)
}

func (service *BusTripReportService) FindByUserIDNextDate(userID uuid.UUID, date time.Time) ([]entities.BusTripReport, error) {
	return service.repo.FindByUserIDNextDate(userID, date)
}

// Verify if user exists
// Verify if date exists
func (service *BusTripReportService) Create(busTripReport *entities.BusTripReport) error {
	return service.repo.Create(busTripReport)
}

func (service *BusTripReportService) Update(busTripReport *entities.BusTripReport) error {
	return service.repo.Update(busTripReport)
}

func (service *BusTripReportService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
