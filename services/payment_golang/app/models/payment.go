package models

type Payment struct {
	ID       uint    `gorm:"primaryKey" json:"id"`
	Amount   float64 `json:"amount"`
	Currency string  `json:"currency"`
	Status   string  `json:"status"`
}
