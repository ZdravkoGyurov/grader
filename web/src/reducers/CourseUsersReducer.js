import consts from "../consts/consts";

const incrementPageAction = "incrementPage";
const decrementPageAction = "decrementPage";
const setCourseUsersAction = "setCourseUsers";
const createCourseUsersAction = "createCourseUsers";
const updateCourseUsersAction = "updateCourseUsers";
const deleteCourseUsersAction = "deleteCourseUsers";
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
    case createCourseUsersAction:
      const newCourseUsers = [...state.courseUsers];
      newCourseUsers.push(action.courseUser);
      const newLastPageAfterCreate = Math.ceil(
        newCourseUsers.length / consts.courseUsersPageSize
      );

      return {
        ...state,
        courseUsers: newCourseUsers,
        page:
          newLastPageAfterCreate > state.lastPage ? state.page + 1 : state.page,
        lastPage: newLastPageAfterCreate,
      };
    case updateCourseUsersAction:
      return {
        ...state,
        courseUsers: [...state.courseUsers].map((uc) =>
          uc.userEmail === action.courseUser.userEmail ? action.courseUser : uc
        ),
      };
    case deleteCourseUsersAction:
      const newLastPageAfterDelete = Math.ceil(
        (state.courseUsers.length - 1) / consts.coursesPageSize
      );

      return {
        ...state,
        courseUsers: [...state.courseUsers].filter(
          (uc) => uc.userEmail !== action.userEmail
        ),
        page:
          newLastPageAfterDelete < state.lastPage ? state.page - 1 : state.page,
        lastPage: newLastPageAfterDelete,
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
  createCourseUsersAction,
  updateCourseUsersAction,
  deleteCourseUsersAction,
  setErrorAction,
};

export default courseUsersReducer;
