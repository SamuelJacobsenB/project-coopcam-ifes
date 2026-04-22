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

func (s *MonthlyFeeConfigService) FindByYear(year int) ([]entities.MonthlyFeeConfig, error) {
	return s.repo.FindByYear(year)
}

func (s *MonthlyFeeConfigService) CreateConfigAndDrafts(config *entities.MonthlyFeeConfig) error {
	return s.repo.db.Transaction(func(tx *gorm.DB) error {
		var count int64
		if err := tx.Model(&entities.MonthlyFeeConfig{}).
			Where("month = ? AND year = ?", config.Month, config.Year).
			Count(&count).Error; err != nil {
			return err
		}
		if count > 0 {
			return errors.New("já existe uma configuração para este mês e ano")
		}

		var paymentCount int64
		if err := tx.Model(&entities.MonthlyPayment{}).
			Where("month = ? AND year = ?", config.Month, config.Year).
			Count(&paymentCount).Error; err != nil {
			return err
		}
		if paymentCount > 0 {
			return errors.New("já existem pagamentos gerados para este período")
		}

		// Criar a Configuração
		if err := tx.Create(config).Error; err != nil {
			return err
		}

		// Processamento em Lotes (FindInBatches)
		const batchSize = 100
		err := tx.Model(&entities.User{}).FindInBatches(&[]entities.User{}, batchSize, func(txBatch *gorm.DB, batch int) error {
			var users []entities.User
			if err := txBatch.Find(&users).Error; err != nil {
				return err
			}

			payments := make([]entities.MonthlyPayment, 0, len(users))
			for _, u := range users {
				amount := config.BaseAmount
				if u.HasFinancialAid {
					amount = config.FinancialAidAmount
				}

				payments = append(payments, entities.MonthlyPayment{
					ID:            uuid.New(),
					UserID:        u.ID,
					UserName:      u.Name,
					Month:         config.Month,
					Year:          config.Year,
					AmountDue:     amount,
					DueDate:       config.DueDate,
					PaymentStatus: types.PaymentDraft,
				})
			}

			if len(payments) > 0 {
				if err := tx.Create(&payments).Error; err != nil {
					return err
				}
			}
			return nil
		}).Error

		return err
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
