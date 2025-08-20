package bus_trip_report

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/user"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type BusTripReport struct {
	ID        uuid.UUID
	UserID    uuid.UUID
	Date      time.Time
	Period    types.Period
	Marked    bool
	Attended  bool
	CreatedAt time.Time
	UpdatedAt time.Time

	User *user.User
}
