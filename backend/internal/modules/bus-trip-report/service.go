package bus_trip_report

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	bus_reservation "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-reservation"
	bus_trip "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/bus-trip"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/google/uuid"
)

type BusTripReportService struct {
	repo            *BusTripReportRepository
	reservationRepo *bus_reservation.BusReservationRepository
	userRepo        *user.UserRepository
	busTripRepo     *bus_trip.BusTripRepository
}

func NewBusTripReportService(repo *BusTripReportRepository, reservationRepo *bus_reservation.BusReservationRepository, userRepo *user.UserRepository, busTripRepo *bus_trip.BusTripRepository) *BusTripReportService {
	return &BusTripReportService{repo, reservationRepo, userRepo, busTripRepo}
}

func (service *BusTripReportService) FindAll() ([]entities.BusTripReport, error) {
	return service.repo.FindAll()
}

func (service *BusTripReportService) FindByID(id uuid.UUID) (*entities.BusTripReport, error) {
	return service.repo.FindByID(id)
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

func (service *BusTripReportService) FindByUserAndMonth(userID uuid.UUID, month int) ([]entities.BusTripReport, error) {
	return service.repo.FindByUserAndMonth(userID, month)
}

func (service *BusTripReportService) CreateMany(busTripID uuid.UUID, userIDs []uuid.UUID) error {
	if len(userIDs) == 0 {
		return nil
	}

	busTrip, err := service.busTripRepo.FindByID(busTripID)
	if err != nil {
		return err
	}

	var users []entities.User
	if err := service.repo.db.Select("id, name").Where("id IN ?", userIDs).Find(&users).Error; err != nil {
		return err
	}
	userMap := make(map[uuid.UUID]string, len(users))
	for _, u := range users {
		userMap[u.ID] = u.Name
	}

	// Busca apenas as Reservas dos usuários que acabaram de entrar no ônibus
	var reservations []entities.BusReservation
	if err := service.repo.db.Select("user_id").Where("bus_trip_id = ? AND user_id IN ?", busTripID, userIDs).Find(&reservations).Error; err != nil {
		return err
	}
	reservedMap := make(map[uuid.UUID]bool, len(reservations))
	for _, r := range reservations {
		reservedMap[r.UserID] = true
	}

	// Busca se esses usuários JÁ TÊM relatório nesta viagem (contra requisições duplicadas)
	var existingReports []entities.BusTripReport
	if err := service.repo.db.Select("user_id").Where("bus_trip_id = ? AND user_id IN ?", busTripID, userIDs).Find(&existingReports).Error; err != nil {
		return err
	}
	existingMap := make(map[uuid.UUID]bool, len(existingReports))
	for _, r := range existingReports {
		existingMap[r.UserID] = true
	}

	var newReports []entities.BusTripReport
	processedRequestIDs := make(map[uuid.UUID]bool)

	for _, userID := range userIDs {
		if existingMap[userID] || processedRequestIDs[userID] {
			continue
		}
		processedRequestIDs[userID] = true

		newReports = append(newReports, entities.BusTripReport{
			ID:        uuid.New(),
			UserID:    userID,
			BusTripID: busTripID,
			UserName:  userMap[userID],
			Date:      busTrip.Date,
			Period:    busTrip.Period,
			Direction: busTrip.Direction,
			Marked:    reservedMap[userID],
			Attended:  true,
		})
	}

	if len(newReports) > 0 {
		if err := service.repo.db.CreateInBatches(newReports, 100).Error; err != nil {
			return err
		}
	}

	return nil
}

func (service *BusTripReportService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
