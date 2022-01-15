package handlers

import (
	"net/http"

	"github.com/gorilla/mux"
)

const id = "id"

func pathParam(request *http.Request) string {
	value, ok := mux.Vars(request)[id]
	if !ok {
		panic("could not find id path param")
	}
	return value
}
