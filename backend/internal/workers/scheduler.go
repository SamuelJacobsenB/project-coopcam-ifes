package workers

import (
	"time"

	cron "github.com/robfig/cron/v3"
)

type Scheduler struct {
	cron *cron.Cron
}

func NewScheduler() *Scheduler {
	loc, _ := time.LoadLocation("America/Sao_Paulo")
	return &Scheduler{
		cron: cron.New(cron.WithLocation(loc)),
	}
}

func (s *Scheduler) RegisterTask(cronExpression string, fn func()) error {
	_, err := s.cron.AddFunc(cronExpression, fn)
	return err
}

func (s *Scheduler) Start() {
	s.cron.Start()
}
