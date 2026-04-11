package bus_trip

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type BusTripService struct {
	repo *BusTripRepository
}

func NewBusTripService(repo *BusTripRepository) *BusTripService {
	return &BusTripService{repo}
}

func (service *BusTripService) FindAll() ([]entities.BusTrip, error) {
	return service.repo.FindAll()
}

func (service *BusTripService) FindByDate(date time.Time) ([]entities.BusTrip, error) {
	return service.repo.FindByDate(date)
}

func (service *BusTripService) FindByNextDate(date time.Time) ([]entities.BusTrip, error) {
	return service.repo.FindByNextDate(date)
}

func (service *BusTripService) FindByID(id uuid.UUID) (*entities.BusTrip, error) {
	return service.repo.FindByID(id)
}

func (service *BusTripService) Create(busTrip *entities.BusTrip) error {
	return service.repo.Create(busTrip)
}

func (service *BusTripService) Update(busTrip *entities.BusTrip) error {
	currentTrip, err := service.repo.FindByID(busTrip.ID)
	if err != nil {
		return err
	}

	if err := service.repo.Update(busTrip); err != nil {
		return err
	}

	return service.repo.db.Transaction(func(tx *gorm.DB) error {
		// Verifica se o status está mudando para FINALIZADO neste momento
		if busTrip.Status == types.Finished && currentTrip.Status != types.Finished {

			//Busca todas as RESERVAS para essa viagem
			var reservations []entities.BusReservation
			if err := tx.Where("bus_trip_id = ?", busTrip.ID).Find(&reservations).Error; err != nil {
				return err
			}

			// Busca os RELATÓRIOS já existentes (ou seja, quem o motorista bipou/marcou como presente)
			var existingReports []entities.BusTripReport
			if err := tx.Where("bus_trip_id = ?", busTrip.ID).Find(&existingReports).Error; err != nil {
				return err
			}

			// Cria um mapa de quem já tem relatório (Presenças) para busca rápida O(1)
			processedUsers := make(map[uuid.UUID]bool)
			for _, report := range existingReports {
				processedUsers[report.UserID] = true
			}

			// Identifica os FALTOSOS (Quem tem reserva, mas não tem relatório gerado)
			var absentReports []entities.BusTripReport
			for _, res := range reservations {
				if !processedUsers[res.UserID] {
					absentReports = append(absentReports, entities.BusTripReport{
						ID:        uuid.New(),
						UserID:    res.UserID,
						BusTripID: busTrip.ID,
						UserName:  res.UserName,
						Date:      busTrip.Date,
						Period:    busTrip.Period,
						Direction: busTrip.Direction,
						Marked:    true,
						Attended:  false,
					})
				}
			}

			// Salva os faltosos no banco em lote
			if len(absentReports) > 0 {
				if err := tx.CreateInBatches(absentReports, 100).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

func (service *BusTripService) Delete(id uuid.UUID) error {
	return service.repo.Delete(id)
}
