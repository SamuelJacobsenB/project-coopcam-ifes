package user

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"github.com/lib/pq"
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
	user.Roles = pq.StringArray{types.RoleUser}
	user.ID = uuid.New()

	return repo.db.Create(user).Error
}

func (repo *UserRepository) Update(user *entities.User) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", user.ID).Updates(user).Error
}

func (repo *UserRepository) UpdateAvatarURL(avatarURL string, id uuid.UUID) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", id).Update("avatar_url", avatarURL).Error
}

func (repo *UserRepository) PromoteToCoordinator(id uuid.UUID) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", id).Update("roles", gorm.Expr("?", pq.StringArray{types.RoleUser, types.RoleCoordinator})).Error
}

func (repo *UserRepository) DemoteFromCoordinator(id uuid.UUID) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", id).Update("roles", gorm.Expr("?", pq.StringArray{types.RoleUser})).Error
}

func (repo *UserRepository) PromoteToAdmin(id uuid.UUID) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", id).Update("roles", gorm.Expr("?", pq.StringArray{types.RoleUser, types.RoleCoordinator, types.RoleAdmin})).Error
}

func (repo *UserRepository) DemoteFromAdmin(id uuid.UUID) error {
	return repo.db.Model(&entities.User{}).Where("id = ?", id).Update("roles", gorm.Expr("?", pq.StringArray{types.RoleUser, types.RoleCoordinator})).Error
}

func (repo *UserRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&entities.User{}).Error
}
