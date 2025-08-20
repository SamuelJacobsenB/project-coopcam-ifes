package available_override

import (
	"time"

	"github.com/google/uuid"
)

type AvailableOverride struct {
	ID        uuid.UUID
	Date      time.Time
	Reason    string
	CreatedAt time.Time
	UpdatedAt time.Time
}
