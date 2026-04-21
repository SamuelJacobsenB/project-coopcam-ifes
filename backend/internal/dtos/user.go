package dtos

import (
	"errors"
	"strings"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/utils"
	"github.com/google/uuid"
)

type UserRequestDTO struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`

	CPF     string    `json:"cpf"`
	Phone   string    `json:"phone"`
	Address string    `json:"address"`
	CEP     string    `json:"cep"`
	Birth   time.Time `json:"birth"`

	HasFinancialAid bool `json:"has_financial_aid"`
}

func (dto *UserRequestDTO) Validate() error {
	if dto.Name == "" {
		return errors.New("nome é obrigatório")
	}

	if dto.Email == "" {
		return errors.New("email é obrigatório")
	}
	if !strings.Contains(dto.Email, "@") {
		return errors.New("email inválido")
	}

	if dto.Password == "" {
		return errors.New("senha é obrigatória")
	}

	if err := utils.ValidatePassword(dto.Password); err != nil {
		return err
	}

	if dto.CPF == "" {
		return errors.New("cpf é obrigatório")
	}

	if err := utils.ValidateCPF(dto.CPF); err != nil {
		return err
	}

	if dto.Phone == "" {
		return errors.New("telefone é obrigatório")
	}

	if dto.Address == "" {
		return errors.New("endereço é obrigatório")
	}

	if dto.CEP == "" {
		return errors.New("cep é obrigatório")
	}

	if err := utils.ValidateCEP(dto.CEP); err != nil {
		return err
	}

	if dto.Birth.IsZero() {
		return errors.New("data de nascimento é obrigatória")
	}

	return nil
}

func (dto *UserRequestDTO) ToEntity() *entities.User {
	return &entities.User{
		Name:            dto.Name,
		Email:           dto.Email,
		Password:        dto.Password,
		CPF:             dto.CPF,
		Phone:           dto.Phone,
		Address:         dto.Address,
		CEP:             dto.CEP,
		Birth:           dto.Birth,
		HasFinancialAid: dto.HasFinancialAid,
	}
}

type UserUpdateDTO struct {
	Name     *string `json:"name"`
	Email    *string `json:"email"`
	Password *string `json:"password"`

	CPF     *string    `json:"cpf"`
	Phone   *string    `json:"phone"`
	Address *string    `json:"address"`
	CEP     *string    `json:"cep"`
	Birth   *time.Time `json:"birth"`

	HasFinancialAid *bool `json:"has_financial_aid"`
}

func (dto *UserUpdateDTO) Validate() error {
	if dto.Name != nil && *dto.Name == "" {
		return errors.New("nome é obrigatório")
	}

	if dto.Email != nil && *dto.Email == "" {
		return errors.New("email é obrigatório")
	}

	if dto.Email != nil && !strings.Contains(*dto.Email, "@") {
		return errors.New("email inválido")
	}

	if dto.Password != nil && *dto.Password == "" {
		return errors.New("senha é obrigatória")
	}

	if dto.Password != nil {
		if err := utils.ValidatePassword(*dto.Password); err != nil {
			return err
		}
	}

	if dto.CPF != nil && *dto.CPF == "" {
		return errors.New("cpf é obrigatório")
	}

	if err := utils.ValidateCPF(*dto.CPF); err != nil {
		return err
	}

	if dto.Phone != nil && *dto.Phone == "" {
		return errors.New("telefone é obrigatório")
	}

	if dto.Address != nil && *dto.Address == "" {
		return errors.New("endereço é obrigatório")
	}

	if dto.CEP != nil && *dto.CEP == "" {
		return errors.New("cep é obrigatório")
	}

	if err := utils.ValidateCEP(*dto.CEP); err != nil {
		return err
	}

	if dto.Birth != nil && dto.Birth.IsZero() {
		return errors.New("data de nascimento é obrigatória")
	}

	return nil
}

func (dto *UserUpdateDTO) ToEntity() *entities.User {
	user := entities.User{}

	if dto.Name != nil {
		user.Name = *dto.Name
	}

	if dto.Email != nil {
		user.Email = *dto.Email
	}

	if dto.Password != nil {
		user.Password = *dto.Password
	}

	if dto.CPF != nil {
		user.CPF = *dto.CPF
	}

	if dto.Phone != nil {
		user.Phone = *dto.Phone
	}

	if dto.Address != nil {
		user.Address = *dto.Address
	}

	if dto.CEP != nil {
		user.CEP = *dto.CEP
	}

	if dto.Birth != nil {
		user.Birth = *dto.Birth
	}

	if dto.HasFinancialAid != nil {
		user.HasFinancialAid = *dto.HasFinancialAid
	}

	return &user
}

type UserResponseDTO struct {
	ID uuid.UUID `json:"id"`

	Name  string `json:"name"`
	Email string `json:"email"`
	Role  string `json:"roles"`

	CPF       string  `json:"cpf"`
	Phone     string  `json:"phone"`
	Address   string  `json:"address"`
	CEP       string  `json:"cep"`
	Birth     string  `json:"birth"`
	AvatarURL *string `json:"avatar_url"`

	HasFinancialAid bool `json:"has_financial_aid"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func ToUserResponseDTO(entity *entities.User) *UserResponseDTO {
	return &UserResponseDTO{
		ID:              entity.ID,
		Name:            entity.Name,
		Email:           entity.Email,
		Role:            entity.Role,
		CPF:             entity.CPF,
		Phone:           entity.Phone,
		Address:         entity.Address,
		CEP:             entity.CEP,
		Birth:           entity.Birth.Format("02/01/2006"),
		HasFinancialAid: entity.HasFinancialAid,
		CreatedAt:       entity.CreatedAt,
		UpdatedAt:       entity.UpdatedAt,
	}
}
