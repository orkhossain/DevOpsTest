package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/streadway/amqp"
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

func connectToRabbitMQ() {
	fmt.Println("RabbitMQ in Golang: Getting started tutorial")

	connection, err := amqp.Dial("amqp://user:password@rabbitmq:5672//")
	if err != nil {
		panic(err)
	}
	defer connection.Close()

	fmt.Println("Successfully connected to RabbitMQ instance")

	// opening a channel over the connection established to interact with RabbitMQ
	channel, err := connection.Channel()
	if err != nil {
		panic(err)
	}
	defer channel.Close()

	// declaring consumer with its properties over channel opened
	msgs, err := channel.Consume(
		"hello", // queue
		"",      // consumer
		true,    // auto ack
		false,   // exclusive
		false,   // no local
		false,   // no wait
		nil,     //args
	)
	if err != nil {
		panic(err)
	}

	// print consumed messages from queue
	forever := make(chan bool)
	go func() {
		for msg := range msgs {
			fmt.Printf("Received Message: %s\n", msg.Body)
		}
	}()

	fmt.Println("Waiting for messages...")
	<-forever

}
func kafkaConsumer() {

	c, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": "kafka:9092",
		"group.id":          "1",
		"auto.offset.reset": "earliest",
	})

	if err != nil {
		panic(err)
	}

	c.SubscribeTopics([]string{"test", "^aRegex.*[Tt]opic"}, nil)
	run := true

	for run {
		msg, err := c.ReadMessage(time.Second)
		if err == nil {
			fmt.Printf("Message on %s: %s\n", msg.TopicPartition, string(msg.Value))
		} else if !err.(kafka.Error).IsTimeout() {
			// The client will automatically try to recover from all errors.
			// Timeout is not considered an error because it is raised by
			// ReadMessage in absence of messages.
			fmt.Printf("Consumer error: %v (%v)\n", err, msg)
		}
	}

	c.Close()
}

func init() {
	var err error
	db, err = connectToMariaDB()
	if err != nil {
		log.Fatal("Error connecting to MariaDB:", err)
	}

	// Perform database migration
	if err := db.AutoMigrate(&Payment{}); err != nil {
		log.Fatal("Error performing database migration:", err)
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

func main() {
	port := ":80"
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/api/payment", handlePayments)
	r.Post("/api/payment/create", createPayment)
	log.Printf("Server started on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
	connectToRabbitMQ()
	kafkaConsumer()

}
