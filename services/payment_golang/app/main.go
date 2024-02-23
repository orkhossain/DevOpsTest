package main

import (
	"log"
	"net/http"

	"payment_golang/app/config"
	"payment_golang/app/database"
	"payment_golang/app/routes"

	"github.com/go-chi/chi"
)

func main() {
	database.InitDB()

	port := config.GetEnvVariable("PORT", ":80")
	r := chi.NewRouter()
	routes.SetMiddleware(r)
	r.Get("/api/payment", routes.HandlePayments(database.DB))
	r.Post("/api/payment/create", routes.CreatePayment(database.DB))
	log.Printf("Server started on port %s\n", port)
	log.Fatal(http.ListenAndServe(port, r))
}
