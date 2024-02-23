package routes

import (
	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
)

func SetMiddleware(r *chi.Mux) {
	r.Use(middleware.Logger)
}
