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
    case "setCourses":
      return {
        ...state,
        courses: action.courses,
        lastPage:
          action.courses.length > 0
            ? Math.ceil(action.courses.length / consts.coursesPageSize)
            : 1,
        fetched: true,
        error: null,
      };
    case "createCourse":
      const newCourses = [...state.courses];
      newCourses.push(action.course);
      const newLastPageAfterCreate = Math.ceil(
        newCourses.length / consts.coursesPageSize
      );

      return {
        ...state,
        courses: newCourses,
        page:
          newLastPageAfterCreate > state.lastPage ? state.page + 1 : state.page,
        lastPage: newLastPageAfterCreate,
      };
    case "updateCourse":
      return {
        ...state,
        courses: [...state.courses].map((c) =>
          c.id === action.course.id ? action.course : c
        ),
      };
    case "deleteCourse":
      const newLastPageAfterDelete =
        state.courses.length - 1 === 0
          ? 1
          : Math.ceil((state.courses.length - 1) / consts.coursesPageSize);
      return {
        ...state,
        courses: [...state.courses].filter((c) => c.id !== action.courseId),
        page:
          newLastPageAfterDelete < state.lastPage ? state.page - 1 : state.page,
        lastPage: newLastPageAfterDelete,
      };
    case "setError":
      return {
        ...state,
        courses: null,
        lastPage: 1,
        fetched: true,
        error: action.error,
      };
    default:
      throw new Error("Wrong reducer action type");
  }
}

const initialState = {
  courses: null,
  page: 1,
  lastPage: 1,
  fetched: false,
  error: null,
};

const coursesReducer = {
  reducer,
  initialState,
};

export default coursesReducer;
