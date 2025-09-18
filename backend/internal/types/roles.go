package types

import "slices"

const (
	RoleAdmin       string = "admin"
	RoleCoordinator string = "coordinator"
	RoleUser        string = "user"
)

func ValidateRole(role string) bool {
	switch role {
	case RoleAdmin, RoleCoordinator, RoleUser:
		return true
	default:
		return false
	}
}

func ValidateUserRoles(roles []string) bool {
	for _, role := range roles {
		if !ValidateRole(role) {
			return false
		}
	}
	return true
}

func HasRoles(userRoles []string, allowedRoles ...string) bool {
	for _, role := range allowedRoles {
		if !slices.Contains(userRoles, role) {
			return false
		}
	}

	return true
}
