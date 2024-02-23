package database

import (
	"fmt"
	"log"
	"models"
	"os"
	"os/signal"
	"syscall"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectToMariaDB() (*gorm.DB, error) {
	connectionString := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s", os.Getenv("MARIADB_USER"), os.Getenv("MARIADB_PASSWORD"), os.Getenv("MARIADB_HOST"), os.Getenv("MARIADB_PORT"), os.Getenv("MARIADB_DATABASE"))
	db, err := gorm.Open(mysql.Open(connectionString), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return db, nil
}

func InitDB() {
	var err error
	DB, err = ConnectToMariaDB()
	if err != nil {
		log.Fatal(err)
	}

	// Perform database migration
	err = DB.AutoMigrate(&models.Payment{})
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
		if DB != nil {
			sqlDB, err := DB.DB()
			if err != nil {
				log.Println("Error getting database connection:", err)
			} else {
				sqlDB.Close()
			}
		}

		os.Exit(0)
	}()
}
