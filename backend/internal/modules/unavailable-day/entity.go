package unavailable_day

import (
	"time"

	"github.com/google/uuid"
)

type UnavailableDay struct {
	ID        uuid.UUID
	Date      time.Time
	Reason    string
	CreatedAt time.Time
	UpdatedAt time.Time
}
