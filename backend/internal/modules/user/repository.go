package user

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db}
}

func (repo *UserRepository) FindAll() ([]entities.User, error) {
	var users []entities.User
	err := repo.db.Find(&users).Error
	return users, err
}

func (repo *UserRepository) FindPaginated(offset int, limit int, namePrefix string) ([]entities.User, error) {
	var users []entities.User
	query := repo.db.Model(&entities.User{}).Limit(limit).Offset(offset)
	if namePrefix != "" {
		query = query.Where("name ILIKE ?", namePrefix+"%")
	}
	if err := query.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (repo *UserRepository) FindByID(id uuid.UUID) (*entities.User, error) {
	var user entities.User
	err := repo.db.Where("id = ?", id).First(&user).Error
	return &user, err
}

func (repo *UserRepository) FindByEmail(email string) (*entities.User, error) {
	var user entities.User
	err := repo.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (repo *UserRepository) Create(user *entities.User) error {
	user.ID = uuid.New()

	return repo.db.Create(user).Error
}

func (repo *UserRepository) Update(user *entities.User) error {
	return repo.db.Model(&entities.User{}).
		Where("id = ?", user.ID).
		Select("Name", "Email", "Phone", "Address", "CPF", "CEP", "Birth", "HasFinancialAid", "Password").
		Updates(user).Error
}

func (repo *UserRepository) PromoteToDriver(id uuid.UUID) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", id).Update("role", types.RoleDriver).Error
}

func (repo *UserRepository) PromoteToAdmin(id uuid.UUID) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", id).Update("role", types.RoleAdmin).Error
}

func (repo *UserRepository) DemoteToUser(id uuid.UUID) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", id).Update("role", types.RoleUser).Error
}

func (repo *UserRepository) Delete(id uuid.UUID) error {
	return repo.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("user_id = ?", id).Delete(&entities.BusTripReport{}).Error; err != nil {
			return err
		}

		if err := tx.Where("user_id = ?", id).Delete(&entities.BusReservation{}).Error; err != nil {
			return err
		}

		if err := tx.Where("user_id = ?", id).Delete(&entities.Template{}).Error; err != nil {
			return err
		}

		if err := tx.Where("user_id = ?", id).Delete(&entities.MonthlyPayment{}).Error; err != nil {
			return err
		}

		if err := tx.Where("user_id = ?", id).Delete(&entities.User{}).Error; err != nil {
			return err
		}

		return nil
	})
}
