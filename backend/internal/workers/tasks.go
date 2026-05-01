package workers

import (
	"fmt"
	"log"
	"time"

	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/audit"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/entities"
	"github.com/SamuelJacobsenB/project-coopcam-ifes/backend/internal/types"
	"github.com/google/uuid"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

func CreateTripsAndWeeklyPreferences(db *gorm.DB) {
	err := db.Transaction(func(tx *gorm.DB) error {
		loc, err := time.LoadLocation("America/Sao_Paulo")
		if err != nil {
			return err
		}

		now := time.Now().In(loc)
		weekStart := time.Date(now.Year(), now.Month(), now.Day(), 1, 0, 0, 0, loc)
		weekEnd := weekStart.Add(7 * 24 * time.Hour)

		// Buscar Exceções
		var availableOverrides []entities.AvailableOverride
		var unavailableDays []entities.UnavailableDay
		tx.Where("date BETWEEN ? AND ?", weekStart, weekEnd).Find(&availableOverrides)
		tx.Where("date BETWEEN ? AND ?", weekStart, weekEnd).Find(&unavailableDays)

		format := func(t time.Time) string { return t.Format("2006-01-02") }
		isAvailable := make(map[string]bool)

		// Lógica padrão Seg-Sex
		for d := 0; d < 7; d++ {
			day := weekStart.AddDate(0, 0, d)
			wd := day.Weekday()
			isAvailable[format(day)] = (wd != time.Saturday && wd != time.Sunday)
		}
		for _, av := range availableOverrides {
			isAvailable[format(av.Date)] = true
		}
		for _, un := range unavailableDays {
			isAvailable[format(un.Date)] = false
		}

		// Criar BusTrips e Mapear IDs
		var busTrips []entities.BusTrip
		tripMap := make(map[string]uuid.UUID)

		for d := 0; d < 7; d++ {
			day := weekStart.AddDate(0, 0, d)
			if !isAvailable[format(day)] {
				continue
			}

			for _, p := range []types.Period{"morning", "afternoon"} {
				for _, dir := range []types.Direction{"go", "return"} {
					trip := entities.BusTrip{
						ID:        uuid.New(),
						Date:      day,
						Period:    p,
						Direction: dir,
						Status:    "unstarted",
					}
					busTrips = append(busTrips, trip)
					tripMap[fmt.Sprintf("%s-%s-%s", format(day), p, dir)] = trip.ID
				}
			}
		}

		if len(busTrips) > 0 {
			if err := tx.Create(&busTrips).Error; err != nil {
				return err
			}
		}

		// Limpar preferências e preparar Usuários
		tx.Session(&gorm.Session{AllowGlobalUpdate: true}).Delete(&entities.WeeklyPreference{})

		var users []entities.User
		tx.Find(&users)

		var weeklyPreferences []entities.WeeklyPreference
		prefMap := make(map[uuid.UUID]uuid.UUID)
		userNameMap := make(map[uuid.UUID]string) // Para salvar o UserName na reserva

		for _, user := range users {
			pref := entities.WeeklyPreference{
				ID:        uuid.New(),
				UserID:    user.ID,
				WeekStart: weekStart,
			}
			weeklyPreferences = append(weeklyPreferences, pref)
			prefMap[user.ID] = pref.ID
			userNameMap[user.ID] = user.Name
		}

		if len(weeklyPreferences) > 0 {
			tx.CreateInBatches(&weeklyPreferences, 100)
		}

		// Processar Templates e Reservas
		var templates []entities.Template
		tx.Find(&templates)

		var busReservations []entities.BusReservation

		processSchedule := func(uID uuid.UUID, pID uuid.UUID, uName string, days pq.Int64Array, p types.Period, d types.Direction) {
			for _, targetWD := range days {
				for i := 0; i < 7; i++ {
					currentDay := weekStart.AddDate(0, 0, i)
					if int64(currentDay.Weekday()) == targetWD {
						key := fmt.Sprintf("%s-%s-%s", format(currentDay), p, d)
						if tripID, exists := tripMap[key]; exists {
							busReservations = append(busReservations, entities.BusReservation{
								ID:                 uuid.New(),
								UserID:             uID,
								UserName:           uName,
								BusTripID:          tripID,
								WeeklyPreferenceID: pID,
								Date:               currentDay,
								Period:             p,
								Direction:          d,
							})
						}
					}
				}
			}
		}

		for _, template := range templates {
			pID := prefMap[template.UserID]
			uName := userNameMap[template.UserID]

			// Ida
			processSchedule(template.UserID, pID, uName, template.GoSchedule.MorningDays, "morning", "go")
			processSchedule(template.UserID, pID, uName, template.GoSchedule.AfternoonDays, "afternoon", "go")

			// Volta
			processSchedule(template.UserID, pID, uName, template.ReturnSchedule.MorningDays, "morning", "return")
			processSchedule(template.UserID, pID, uName, template.ReturnSchedule.AfternoonDays, "afternoon", "return")
		}

		// Salvar Reservas
		if len(busReservations) > 0 {
			if err := tx.CreateInBatches(&busReservations, 100).Error; err != nil {
				return err
			}
		}

		log.Printf("[Job Success] %d viagens, %d reservas criadas", len(busTrips), len(busReservations))
		return nil
	})

	if err != nil {
		log.Printf("[Job Error] %v", err)
	}
}

func DeleteOldInformation(db *gorm.DB) {
	loc, err := time.LoadLocation("America/Sao_Paulo")
	if err != nil {
		log.Printf("[Job Error] Erro ao carregar timezone: %v", err)
		return
	}

	now := time.Now().In(loc)

	err = db.Transaction(func(tx *gorm.DB) error {
		limitDate := time.Date(now.Year(), time.December, 31, 0, 0, 0, 0, loc)

		entitiesToDelete := []interface{}{
			&entities.AvailableOverride{},
			&entities.UnavailableDay{},
			&entities.BusTripReport{},
			&entities.BusReservation{},
			&entities.BusTrip{},
		}

		for _, entity := range entitiesToDelete {
			if err := tx.Unscoped().Where("date < ?", limitDate).Delete(entity).Error; err != nil {
				return err
			}
		}

		log.Println("[Job Success] Limpeza anual concluida com sucesso.")

		return nil
	})

	if err != nil {
		log.Printf("[Job Error] Falha na transação de limpeza: %v", err)
	} else {
		log.Println("[Job Success] Limpeza anual concluída com sucesso.")
	}
}

func DeleteAuditLogs(db *gorm.DB) {
	err := db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Unscoped().Delete(&audit.AuditEvent{}).Error; err != nil {
			return err
		}

		log.Println("[Job Success] Limpeza de logs concluida com sucesso.")

		return nil
	})

	if err != nil {
		log.Printf("[Job Error] Falha na transação de limpeza: %v", err)
	} else {
		log.Println("[Job Success] Limpeza de logs concluida com sucesso.")
	}
}

func SetupTasks(scheduler *Scheduler, db *gorm.DB) error {
	err := scheduler.RegisterTask("0 1 * * 0", func() {
		CreateTripsAndWeeklyPreferences(db)
	})
	if err != nil {
		return err
	}

	err = scheduler.RegisterTask("0 1 1 1 *", func() {
		DeleteOldInformation(db)
	})
	if err != nil {
		return err
	}

	err = scheduler.RegisterTask("0 1 1 1 *", func() {
		DeleteAuditLogs(db)
	})
	if err != nil {
		return err
	}

	return nil
}
