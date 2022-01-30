import consts from "../consts/consts";

function reducer(state, action) {
  switch (action.type) {
    case "incrementPage":
      return {
        ...state,
        page: state.page < state.lastPage ? state.page + 1 : state.page,
      };
    case "decrementPage":
      return {
        ...state,
        page: state.page > 1 ? state.page - 1 : state.page,
      };
    case "setUsers":
      return {
        ...state,
        users: action.users,
        lastPage: Math.ceil(action.users.length / consts.usersPageSize),
        fetched: true,
        error: null,
      };
    case "updateUser":
      return {
        ...state,
        users: [...state.users].map((c) =>
          c.email === action.user.email ? action.user : c
        ),
      };
    case "setError":
      return {
        ...state,
        users: null,
        lastPage: 1,
        fetched: true,
        error: action.error,
      };
    default:
      throw new Error("Wrong reducer action type");
  }
}

const initialState = {
  users: null,
  page: 1,
  lastPage: 1,
  fetched: false,
  error: null,
};

const usersReducer = {
  reducer,
  initialState,
};

export default usersReducer;
