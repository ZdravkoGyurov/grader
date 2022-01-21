package req

import (
	"context"
	"net/http"

	"github.com/ZdravkoGyurov/grader/pkg/types"
)

type correlationIDKey struct{}
type userDataKey struct{}

var (
	CorrelationIDKey correlationIDKey
	UserDataKey      userDataKey
)

type UserData struct {
	Email    string
	Name     string
	GitlabID string
	RoleName types.Role
}

func AddCorrelationID(r *http.Request, correlationID string) {
	*r = *r.WithContext(context.WithValue(r.Context(), CorrelationIDKey, correlationID))
}

func GetCorrelationID(r *http.Request) (string, bool) {
	correlationID, ok := r.Context().Value(CorrelationIDKey).(string)
	return correlationID, ok
}

func AddUserData(r *http.Request, userData UserData) {
	*r = *r.WithContext(context.WithValue(r.Context(), UserDataKey, userData))
}

func GetUserData(r *http.Request) (UserData, bool) {
	userData, ok := r.Context().Value(UserDataKey).(UserData)
	return userData, ok
}
