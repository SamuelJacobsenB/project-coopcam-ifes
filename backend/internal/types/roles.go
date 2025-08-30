package types

import "slices"

type Role string

const (
	RoleAdmin       Role = "admin"
	RoleCoordinator Role = "coordinator"
	RoleUser        Role = "user"
)

func ValidateRole(role Role) bool {
	switch role {
	case RoleAdmin, RoleCoordinator, RoleUser:
		return true
	default:
		return false
	}
}

func ValidateUserRoles(roles []Role) bool {
	for _, role := range roles {
		if !ValidateRole(role) {
			return false
		}
	}
	return true
}

func HasRoles(userRoles []Role, allowedRoles ...Role) bool {
	for _, role := range allowedRoles {
		if !slices.Contains(userRoles, role) {
			return false
		}
	}

	return true
}
