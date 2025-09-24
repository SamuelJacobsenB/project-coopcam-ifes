package bus_trip_report

import (
	"errors"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/google/uuid"
)

type BusTripReportService struct {
	repo     *BusTripReportRepository
	userRepo *user.UserRepository
}

func NewBusTripReportService(repo *BusTripReportRepository, userRepo *user.UserRepository) *BusTripReportService {
	return &BusTripReportService{repo, userRepo}
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

func (service *BusTripReportService) Create(busTripReport *entities.BusTripReport) error {
	userExists, err := service.userRepo.FindByID(busTripReport.UserID)
	if err != nil {
		return err
	}
	if userExists == nil {
		return errors.New("user not found")
	}

	busTripReport.UserName = userExists.Name

	busTripReportExists, err := service.repo.FindByUserIDAndDateAndPeriod(busTripReport.UserID, busTripReport.Date, busTripReport.Period)
	if err != nil {
		return err
	}
	if busTripReportExists != nil {
		return errors.New("bus trip report already exists")
	}

	return service.repo.Create(busTripReport)
}

func (service *BusTripReportService) Update(busTripReport *entities.BusTripReport) error {
	return service.repo.Update(busTripReport)
}

func (service *BusTripReportService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
