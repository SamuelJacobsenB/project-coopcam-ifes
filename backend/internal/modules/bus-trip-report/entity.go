package bus_trip_report

import (
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/modules/user"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/internal/types"
	"github.com/google/uuid"
)

type BusTripReport struct {
	ID     uuid.UUID `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	UserID uuid.UUID `gorm:"type:uuid;index" json:"user_id"`

	Date     time.Time    `json:"date"`
	Period   types.Period `gorm:"type:text" json:"period"`
	Marked   bool         `json:"marked"`
	Attended bool         `json:"attended"`

	User *user.User `gorm:"foreignKey:UserID" json:"user"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
