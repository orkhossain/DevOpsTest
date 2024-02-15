package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/gocql/gocql"
)

type Payment struct {
	ID       string  `json:"id"`
	Amount   float64 `json:"amount"`
	Currency string  `json:"currency"`
	Status   string  `json:"status"`
}

var payments []Payment

var session *gocql.Session

func init() {
	// Initialize Cassandra session
	cluster := gocql.NewCluster(os.Getenv("CASSANDRA_HOST"))
	cluster.Keyspace = "payments"
	var err error
	session, err = cluster.CreateSession()
	if err != nil {
		log.Fatal(err)
	}
}
func main() {
	port := ":80"

	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Get("/payments", handlePayments)
	r.Post("/payments/create", createPayment)

	log.Printf("Server started on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}

func handlePayments(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		getPayments(w, r)
	default:
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
	}
}

func getPayments(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(payments); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func createPayment(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, http.StatusText(http.StatusMethodNotAllowed), http.StatusMethodNotAllowed)
		return
	}

	var payment Payment
	if err := json.NewDecoder(r.Body).Decode(&payment); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	payment.ID = fmt.Sprintf("PAY-%d", len(payments)+1)
	payment.Status = "Pending"
	payments = append(payments, payment)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	if err := json.NewEncoder(w).Encode(payment); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
