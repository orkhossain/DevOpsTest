package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

type Payment struct {
	ID       uint    `gorm:"primaryKey" json:"id"`
	Amount   float64 `json:"amount"`
	Currency string  `json:"currency"`
	Status   string  `json:"status"`
}

func connectToMariaDB() (*gorm.DB, error) {
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", os.Getenv("MARIADB_USER"), os.Getenv("MARIADB_PASSWORD"), os.Getenv("MARIADB_HOST"), os.Getenv("MARIADB_PORT"), os.Getenv("MARIADB_DATABASE"))
	db, err := gorm.Open(mysql.Open(connectionString), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func init() {
	var err error
	db, err = connectToMariaDB()
	if err != nil {
		log.Fatal(err)
	}

	// Perform database migration
	err = db.AutoMigrate(&Payment{})
	if err != nil {
		log.Fatal(err)
	}

	// Graceful shutdown
	go func() {
		stop := make(chan os.Signal, 1)
		signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
		<-stop

		log.Println("Shutting down...")

		// Close the database connection
		if db != nil {
			sqlDB, err := db.DB()
			if err != nil {
				log.Println("Error getting database connection:", err)
			} else {
				sqlDB.Close()
			}
		}

		os.Exit(0)
	}()
}

func main() {
	port := ":80"
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/api/payment", handlePayments)
	r.Post("/api/payment/create", createPayment)
	log.Printf("Server started on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}

func handlePayments(w http.ResponseWriter, r *http.Request) {
	var payments []Payment
	if err := db.Find(&payments).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(payments)
}

func createPayment(w http.ResponseWriter, r *http.Request) {
	var payment Payment
	fmt.Print(payment)
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if err := db.Create(&payment).Error; err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(payment)
}
