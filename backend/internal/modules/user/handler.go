package user

import (
	"errors"
	"net/http"
	"regexp"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/api"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/audit"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/dtos"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UserHandler struct {
	service *UserService
	logger  *audit.AuditLogger
}

func NewUserHandler(service *UserService, logger *audit.AuditLogger) *UserHandler {
	return &UserHandler{service, logger}
}

func (handler *UserHandler) FindMany(ctx *gin.Context) {
	namePrefix := ctx.Query("name")

	// Validar parâmetro de busca
	if len(namePrefix) > 64 || (namePrefix != "" && !regexp.MustCompile(`^[a-zA-Z0-9\s\-]*$`).MatchString(namePrefix)) {
		api.BadRequest(ctx, "parâmetros de busca inválidos")
		return
	}

	users, err := handler.service.FindMany(namePrefix)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar usuários"))
		return
	}

	usersResponse := make([]dtos.UserResponseDTO, len(users))
	for i, user := range users {
		usersResponse[i] = *dtos.ToUserResponseDTO(&user)
	}

	api.RespondWithSuccess(ctx, http.StatusOK, usersResponse)
}

func (handler *UserHandler) FindOwn(ctx *gin.Context) {
	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		api.BadRequest(ctx, "identificador de usuário inválido no contexto")
		return
	}

	user, err := handler.service.FindByID(userID)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar usuário"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) FindByID(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id de busca inválido")
		return
	}

	userID, err := uuid.Parse(ctx.GetString("user_id"))
	if err != nil {
		api.BadRequest(ctx, "id do usuário logado inválido")
		return
	}

	if id != userID {
		ifUserIsAdmin, err := handler.service.FindByID(userID)
		if err != nil || !types.HasRole(ifUserIsAdmin.Role, []string{types.RoleAdmin, types.RoleDriver}) {
			api.Forbidden(ctx, "você não tem permissão para visualizar este perfil")
			return
		}
	}

	user, err := handler.service.FindByID(id)
	if err != nil {
		api.InternalError(ctx, errors.New("erro interno ao buscar usuário"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusOK, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) Create(ctx *gin.Context) {
	var userRequest dtos.UserRequestDTO
	if err := ctx.ShouldBindJSON(&userRequest); err != nil {
		api.BadRequest(ctx, "dados da requisição inválidos")
		return
	}

	if err := userRequest.Validate(); err != nil {
		api.BadRequest(ctx, err.Error())
		return
	}

	user := userRequest.ToEntity()
	if err := handler.service.Create(user); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao criar usuário"))
		return
	}

	api.RespondWithSuccess(ctx, http.StatusCreated, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) Update(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id para atualização inválido")
		return
	}

	var userRequest dtos.UserUpdateDTO
	if err := ctx.ShouldBindJSON(&userRequest); err != nil {
		api.BadRequest(ctx, "corpo da requisição inválido")
		return
	}

	if err := userRequest.Validate(); err != nil {
		api.BadRequest(ctx, err.Error())
		return
	}

	user := userRequest.ToEntity()
	user.ID = id
	if err := handler.service.Update(user); err != nil {
		api.InternalError(ctx, errors.New("erro interno ao atualizar usuário"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	handler.logger.LogSensitiveAction(
		ctx.Request.Context(),
		"USER_UPDATED",
		"user",
		"Target ID: "+id.String(),
		adminID,
		ctx.ClientIP(),
	)

	api.RespondWithSuccess(ctx, http.StatusOK, dtos.ToUserResponseDTO(user))
}

func (handler *UserHandler) PromoteToDriver(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id inválido")
		return
	}

	if err := handler.service.PromoteToDriver(id); err != nil {
		api.InternalError(ctx, errors.New("error interno ao promover usuário"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	handler.logger.LogRoleChange(
		ctx.Request.Context(),
		id,
		"USER",
		"DRIVER",
		adminID,
	)

	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}

func (handler *UserHandler) PromoteToAdmin(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id inválido")
		return
	}

	if err := handler.service.PromoteToAdmin(id); err != nil {
		api.InternalError(ctx, errors.New("error interno ao promover usuário"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	handler.logger.LogRoleChange(
		ctx.Request.Context(),
		id,
		"USER",
		"ADMIN",
		adminID,
	)

	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}

func (handler *UserHandler) DemoteToUser(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id inválido")
		return
	}

	if err := handler.service.DemoteToUser(id); err != nil {
		api.InternalError(ctx, errors.New("error interno ao rebaixar usuário"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	handler.logger.LogRoleChange(
		ctx.Request.Context(),
		id,
		"DRIVER/ADMIN",
		"USER",
		adminID,
	)

	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}

func (handler *UserHandler) Delete(ctx *gin.Context) {
	id, err := uuid.Parse(ctx.Param("id"))
	if err != nil {
		api.BadRequest(ctx, "id inválido")
		return
	}

	if err := handler.service.Delete(id); err != nil {
		api.InternalError(ctx, errors.New("erro ao deletar usuário"))
		return
	}

	adminID, _ := uuid.Parse(ctx.GetString("user_id"))
	handler.logger.LogDeletion(
		ctx.Request.Context(),
		"user",
		id.String(),
		adminID,
		ctx.ClientIP(),
	)

	api.RespondWithSuccess(ctx, http.StatusOK, nil)
}
