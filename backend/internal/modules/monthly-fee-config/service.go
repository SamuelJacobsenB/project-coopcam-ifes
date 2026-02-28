package monthly_fee_config

import (
	"errors"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	monthly_payment "github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/monthly-payment"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/modules/user"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type MonthlyFeeConfigService struct {
	repo               *MonthlyFeeConfigRepository
	monthlyPaymentRepo *monthly_payment.MonthlyPaymentRepository
	userRepo           *user.UserRepository
}

func NewMonthlyFeeConfigService(repo *MonthlyFeeConfigRepository, userRepo *user.UserRepository, monthlyPaymentRepo *monthly_payment.MonthlyPaymentRepository) *MonthlyFeeConfigService {
	return &MonthlyFeeConfigService{repo: repo, userRepo: userRepo, monthlyPaymentRepo: monthlyPaymentRepo}
}

func (s *MonthlyFeeConfigService) FindByID(id uuid.UUID) (*entities.MonthlyFeeConfig, error) {
	return s.repo.FindByID(id)
}

func (s *MonthlyFeeConfigService) FindByYear(year int) ([]entities.MonthlyFeeConfig, error) {
	return s.repo.FindByYear(year)
}

func (s *MonthlyFeeConfigService) CreateConfigAndDrafts(config *entities.MonthlyFeeConfig) error {
	existing, err := s.repo.FindByMonthYear(config.Month, config.Year)
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return err
	}
	if existing != nil && existing.ID != uuid.Nil {
		return errors.New("já existe uma configuração para este mês e ano")
	}

	paymentsExist, _ := s.monthlyPaymentRepo.ExistsForPeriod(config.Month, config.Year)
	if paymentsExist {
		return errors.New("já existem pagamentos gerados para este período")
	}

	return s.repo.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(config).Error; err != nil {
			return err
		}

		users, err := s.userRepo.FindAll()
		if err != nil {
			return err
		}

		var payments []entities.MonthlyPayment
		for _, user := range users {
			amount := config.BaseAmount
			if user.HasFinancialAid {
				amount = config.FinancialAidAmount
			}

			payments = append(payments, entities.MonthlyPayment{
				ID:        uuid.New(),
				UserID:    user.ID,
				UserName:  user.Name,
				Month:     config.Month,
				Year:      config.Year,
				AmountDue: amount,
				DueDate:   config.DueDate,
				// "Pending" deve ser usado apenas após enviar ao Gateway.
				PaymentStatus: types.PaymentDraft,
			})
		}

		if len(payments) > 0 {
			if err := tx.CreateInBatches(payments, 100).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func (s *MonthlyFeeConfigService) DeleteConfigAndDrafts(id uuid.UUID) error {
	config, err := s.repo.FindByID(id)
	if err != nil {
		return err
	}

	return s.repo.db.Transaction(func(tx *gorm.DB) error {
		// Verifica se existe algum pagamento para este mês/ano que JÁ FOI emitido (ExternalID não nulo)
		var count int64
		tx.Model(&entities.MonthlyPayment{}).
			Where("month = ? AND year = ? AND external_id IS NOT NULL", config.Month, config.Year).
			Count(&count)

		if count > 0 {
			return errors.New("irreversível: não é possível deletar a configuração pois já existem cobranças emitidas no gateway para este mês")
		}

		// Se nenhum foi emitido, deleta os rascunhos
		if err := tx.Where("month = ? AND year = ?", config.Month, config.Year).Delete(&entities.MonthlyPayment{}).Error; err != nil {
			return err
		}

		// Deleta a configuração
		return tx.Delete(&entities.MonthlyFeeConfig{}, "id = ?", id).Error
	})
}
