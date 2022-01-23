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
    case "setCourse":
      return {
        ...state,
        course: action.course,
        fetchedCourse: true,
        courseError: null,
      };
    case "setAssignments":
      return {
        ...state,
        assignments: action.assignments,
        fetchedAssignments: true,
        assignmentsError: null,
        lastPage: Math.ceil(
          action.assignments.length / consts.assignmentsPageSize
        ),
      };
    case "createAssignment":
      const newAssignments = [...state.assignments];
      newAssignments.push(action.assignment);
      const newLastPageAfterCreate = Math.ceil(
        newAssignments.length / consts.assignmentsPageSize
      );

      return {
        ...state,
        assignments: newAssignments,
        page:
          newLastPageAfterCreate > state.lastPage ? state.page + 1 : state.page,
        lastPage: newLastPageAfterCreate,
      };
    case "updateAssignment":
      return {
        ...state,
        assignments: [...state.assignments].map((a) =>
          a.id === action.assignment.id ? action.assignment : a
        ),
      };
    case "deleteAssignment":
      const newLastPageAfterDelete = Math.ceil(
        state.assignments.length - 1 / consts.assignmentsPageSize
      );
      return {
        ...state,
        assignments: [...state.assignments].filter(
          (a) => a.id !== action.assignmentId
        ),
        page:
          newLastPageAfterDelete < state.lastPage ? state.page - 1 : state.page,
        lastPage: newLastPageAfterDelete,
      };
    case "setCourseError":
      return {
        ...state,
        course: null,
        fetchedCourse: true,
        courseError: action.courseError,
      };
    case "setAssignmentsError":
      return {
        ...state,
        assignments: null,
        fetchedAssignments: true,
        assignmentsError: action.assignmentsError,
        lastPage: 1,
      };
    default:
      throw new Error("Wrong reducer action type");
  }
}

const initialState = {
  course: null,
  fetchedCourse: false,
  courseError: null,
  assignments: null,
  fetchedAssignments: false,
  assignmentsError: null,
  page: 1,
  lastPage: 1,
};

const assignmentsReducer = {
  reducer,
  initialState,
};

export default assignmentsReducer;
