import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  IconButton,
  Table,
  TableCaption,
  Tbody,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useReducer } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import courseApi from "../api/course";
import userCourseApi from "../api/usercourse";
import consts from "../consts/consts";
import UserContext from "../contexts/UserContext";
import courseUsersReducer from "../reducers/CourseUsersReducer";
import themeStyles from "../theme";
import CourseUserTableRow from "./CourseUserTableRow";
import CreateUserCourse from "./CreateUserCourse";
import Loading from "./Loading";
import Unauthorized from "./Unauthorized";

export default function CourseUsers() {
  const { locationState } = useLocation();
  const { user } = useContext(UserContext);
  const { courseId } = useParams();
  let navigate = useNavigate();

  const [state, dispatch] = useReducer(
    courseUsersReducer.reducer,
    courseUsersReducer.initialState
  );

  const courseReducer = (state, action) => {
    switch (action.type) {
      case "set":
        return {
          course: action.course || state.course,
          fetched: action.fetched || state.fetched,
          error: action.error || state.error,
        };
      default:
        throw new Error("Wrong reducer action type");
    }
  };
  const [courseState, courseDispatch] = useReducer(courseReducer, {
    course: null,
    fetched: false,
    error: null,
  });

  useEffect(() => {
    async function fetchCourseUsers() {
      try {
        const courseUsers = await userCourseApi.getUserCourses(courseId);
        dispatch({
          type: courseUsersReducer.setCourseUsersAction,
          courseUsers: courseUsers,
          fetched: true,
          error: null,
        });
      } catch (error) {
        console.error(error);
        dispatch({
          type: courseUsersReducer.setErrorAction,
          error: error,
        });
      }
    }

    async function fetchCourse() {
      if (locationState && locationState.course) {
        courseDispatch({
          type: "set",
          course: locationState.course,
          fetched: true,
        });
        return;
      }

      try {
        const course = await courseApi.getCourse(courseId);
        courseDispatch({ type: "set", course: course, fetched: true });
      } catch (error) {
        console.error(error);
        courseDispatch({
          type: "set",
          course: null,
          fetched: true,
          error: error,
        });
      }
    }

    fetchCourseUsers();
    fetchCourse();
  }, []);

  return (
    <Flex flexDir="column" w="100%">
      {!state.fetched || !courseState.fetched ? (
        <Loading />
      ) : (
        <Flex flexDir="column">
          <Flex alignItems="center" marginBottom="1rem" fontSize="2xl">
            <Breadcrumb separator="→">
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate(`/courses`)}>
                  Courses
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate(`/courses/${courseState.course.id}`)}>
                  {courseState.course.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Users</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Flex>
          {user.roleName !== "Admin" && user.roleName !== "Teacher" ? (
            <Unauthorized />
          ) : (
            <Flex m="0 5%" overflowY="auto" flexDir="column" p="2rem">
              {!state.fetched ? (
                <Loading />
              ) : (
                <Table variant="unstyled">
                  <TableCaption m={0} placement="top">
                    Course Users
                  </TableCaption>
                  <Thead borderBottom={`2px solid ${themeStyles.color}`}>
                    <Tr>
                      <Th p="0.5rem">Email</Th>
                      <Th p="0.5rem">Course Role</Th>
                      <Th p="0.5rem">
                        <Flex justifyContent="end">
                          <CreateUserCourse
                            courseUsersDispatch={dispatch}
                            courseId={courseState.course.id}
                          />
                        </Flex>
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {state.courseUsers
                      .slice(
                        (state.page - 1) * consts.courseUsersPageSize,
                        state.page * consts.courseUsersPageSize
                      )
                      .map((userCourse) => (
                        <CourseUserTableRow
                          key={userCourse.userEmail}
                          courseUser={userCourse}
                          creatorEmail={courseState.course.creatorEmail}
                          courseUsersDispatch={dispatch}
                        />
                      ))}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th p="0.5rem"></Th>
                      <Th p="0.5rem"></Th>
                      <Th p="0.5rem">
                        <Flex alignItems="center" justifyContent="end">
                          <IconButton
                            variant="ghost"
                            disabled={state.page === 1}
                            icon={<FiArrowLeft />}
                            _focus={{ boxShadow: "none" }}
                            onClick={() => {
                              dispatch({ type: "decrementPage" });
                            }}
                          />
                          <Text m="0.5rem">Page {state.page} </Text>
                          <IconButton
                            variant="ghost"
                            disabled={state.page >= state.lastPage}
                            icon={<FiArrowRight />}
                            _focus={{ boxShadow: "none" }}
                            onClick={() => {
                              dispatch({ type: "incrementPage" });
                            }}
                          />
                        </Flex>
                      </Th>
                    </Tr>
                  </Tfoot>
                </Table>
              )}
            </Flex>
          )}
        </Flex>
      )}
    </Flex>
  );
}
