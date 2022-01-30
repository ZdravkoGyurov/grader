import consts from "../consts/consts";

const incrementPageAction = "incrementPage";
const decrementPageAction = "decrementPage";
const setCourseUsersAction = "setCourseUsers";
const setErrorAction = "setError";

function reducer(state, action) {
  switch (action.type) {
    case incrementPageAction:
      return {
        ...state,
        page: state.page < state.lastPage ? state.page + 1 : state.page,
      };
    case decrementPageAction:
      return {
        ...state,
        page: state.page > 1 ? state.page - 1 : state.page,
      };
    case setCourseUsersAction:
      return {
        ...state,
        courseUsers: action.courseUsers,
        lastPage: Math.ceil(
          action.courseUsers.length / consts.courseUsersPageSize
        ),
        fetched: true,
        error: null,
      };
    case setErrorAction:
      return {
        ...state,
        courseUsers: null,
        lastPage: 1,
        fetched: true,
        error: action.error,
      };
    default:
      throw new Error("Wrong reducer action type");
  }
}

const initialState = {
  courseUsers: null,
  page: 1,
  lastPage: 1,
  fetched: false,
  error: null,
};

const courseUsersReducer = {
  reducer,
  initialState,
  incrementPageAction,
  decrementPageAction,
  setCourseUsersAction,
  setErrorAction,
};

export default courseUsersReducer;
