package user

import (
	"strconv"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	service *UserService
}

func NewUserHandler(service *UserService) *UserHandler {
	return &UserHandler{service}
}

func (handler *UserHandler) FindAll(ctx *gin.Context) {
	page := ctx.DefaultQuery("page", "1")
	namePrefix := ctx.Query("name")

	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt < 1 {
		ctx.JSON(400, gin.H{"error": "page inválido"})
		return
	}

	const limit = 10
	offset := (pageInt - 1) * limit

	users, err := handler.service.FindPaginated(offset, limit, namePrefix)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	usersResponse := make([]dtos.UserResponseDTO, len(users))
	for i, user := range users {
		usersResponse[i] = *dtos.ToUserResponseDTO(&user)
	}

	ctx.JSON(200, usersResponse)
}

func (handler *UserHandler) FindOwn(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	user, err := handler.service.FindByID(userID)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if id != userID {
		ifUserIsAdmin, err := handler.service.FindByID(userID)
		if !types.HasRoles(ifUserIsAdmin.Roles, types.RoleCoordinator) || err != nil {
			ctx.JSON(403, gin.H{"error": "usuário não autorizado"})
			return
		}
	}

	user, err := handler.service.FindByID(id)
	if err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) Create(ctx *gin.Context) {
	var userRequest dtos.UserRequestDTO
	if err := ctx.ShouldBindJSON(&userRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := userRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user := userRequest.ToEntity()
	if err := handler.service.Create(user); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(201, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	var userRequest dtos.UserRequestDTO
	if err := ctx.ShouldBindJSON(&userRequest); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if err := userRequest.Validate(); err != nil {
		ctx.JSON(400, gin.H{"error": err.Error()})
		return
	}

	user := userRequest.ToEntity()
	user.ID = id
	if err := handler.service.Update(user); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) UpdateAvatar(ctx *gin.Context) {
	// TODO
}

func (handler *UserHandler) PromoteToCoordinator(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.PromoteToCoordinator(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) DemoteFromCoordinator(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.DemoteFromCoordinator(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) PromoteToAdmin(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.PromoteToAdmin(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) DemoteFromAdmin(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.DemoteFromAdmin(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(200, nil)
}

func (handler *UserHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		ctx.JSON(400, gin.H{"error": "id inválido"})
		return
	}

	if err := handler.service.Delete(id); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(204, nil)
}
