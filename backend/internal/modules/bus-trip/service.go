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

func (service *BusTripService) UpdateStatus(id uuid.UUID, status types.Status) error {
	return service.repo.db.Transaction(func(tx *gorm.DB) error {
		// Busca a viagem atual para comparar o status e obter dados (Date, Period, etc)
		currentTrip, err := service.repo.FindByID(id)
		if err != nil {
			return err
		}

		// Atualiza apenas o campo Status dentro da transação
		if err := tx.Model(&entities.BusTrip{}).Where("id = ?", id).Update("status", status).Error; err != nil {
			return err
		}

		// Lógica de fechamento (Se o novo status for Finished e o anterior não era)
		if status == types.Finished && currentTrip.Status != types.Finished {
			var reservations []entities.BusReservation
			// Busca reservas vinculadas a esta viagem específica
			if err := tx.Where("bus_trip_id = ?", id).Find(&reservations).Error; err != nil {
				return err
			}

			var existingReports []entities.BusTripReport
			// Busca relatórios já existentes (presenças marcadas pelo motorista)
			if err := tx.Where("bus_trip_id = ?", id).Find(&existingReports).Error; err != nil {
				return err
			}

			processedUsers := make(map[uuid.UUID]bool)
			for _, report := range existingReports {
				processedUsers[report.UserID] = true
			}

			var absentReports []entities.BusTripReport
			for _, res := range reservations {
				if !processedUsers[res.UserID] {
					// Adiciona à lista de faltosos quem tem reserva mas não tem relatório
					absentReports = append(absentReports, entities.BusTripReport{
						ID:        uuid.New(),
						UserID:    res.UserID,
						BusTripID: id,
						UserName:  res.UserName,
						Date:      currentTrip.Date,
						Period:    currentTrip.Period,
						Direction: currentTrip.Direction,
						Marked:    true,
						Attended:  false,
					})
				}
			}

			// Salva os relatórios de falta em lote
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
