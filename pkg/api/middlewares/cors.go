package middlewares

import (
	"fmt"
	"net/http"
)

func Cors(next http.Handler) http.Handler {
	return http.HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		fmt.Println(">>> here")
		writer.Header().Set("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Access-Control-Allow-Origin, Access-Control-Allow-Methods, Access-Control-Allow-Credentials, Origin, Accept, X-Requested-With, Content-Type")
		writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, PUT, OPTIONS, HEAD")
		writer.Header().Set("Access-Control-Allow-Credentials", "true")
		if request.Method == http.MethodOptions {
			writer.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(writer, request)
	})
}
