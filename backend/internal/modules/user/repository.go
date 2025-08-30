package user

import (
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) *UserRepository {
	return &UserRepository{db}
}

func (repo *UserRepository) FindAll() ([]User, error) {
	var users []User
	err := repo.db.Find(&users).Error
	return users, err
}

func (repo *UserRepository) FindByID(id uuid.UUID) (*User, error) {
	var user User
	err := repo.db.Where("id = ?", id).First(&user).Error
	return &user, err
}

func (repo *UserRepository) FindByEmail(email string) (*User, error) {
	var user User
	err := repo.db.Where("email = ?", email).First(&user).Error
	return &user, err
}

func (repo *UserRepository) Create(user *User) error {
	user.Roles = []types.Role{types.RoleUser}
	return repo.db.Create(user).Error
}

func (repo *UserRepository) Update(user *User) error {
	return repo.db.Where("id = ?", user.ID).Save(user).Error
}

func (repo *UserRepository) UpdateAvatarURL(avatarURL string, id uuid.UUID) error {
	return repo.db.Model(&User{}).Where("id = ?", id).Update("avatar_url", avatarURL).Error
}

func (repo *UserRepository) PromoteToCoordinator(id uuid.UUID) error {
	return repo.db.Model(&User{}).Where("id = ?", id).Update("roles", []types.Role{types.RoleUser, types.RoleCoordinator}).Error
}

func (repo *UserRepository) DemoteFromCoordinator(id uuid.UUID) error {
	return repo.db.Model(&User{}).Where("id = ?", id).Update("roles", []types.Role{types.RoleUser}).Error
}

func (repo *UserRepository) PromoteToAdmin(id uuid.UUID) error {
	return repo.db.Model(&User{}).Where("id = ?", id).Update("roles", []types.Role{types.RoleUser, types.RoleCoordinator, types.RoleAdmin}).Error
}

func (repo *UserRepository) DemoteFromAdmin(id uuid.UUID) error {
	return repo.db.Model(&User{}).Where("id = ?", id).Update("roles", []types.Role{types.RoleUser, types.RoleCoordinator}).Error
}

func (repo *UserRepository) Delete(id uuid.UUID) error {
	return repo.db.Where("id = ?", id).Delete(&User{}).Error
}
