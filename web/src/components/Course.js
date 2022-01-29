import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { IconButton } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import {
  Table,
  TableCaption,
  Tbody,
  Thead,
  Tfoot,
  Th,
  Tr,
} from "@chakra-ui/table";
import { useEffect, useReducer } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router";
import assignmentApi from "../api/assignment";
import courseApi from "../api/course";
import consts from "../consts/consts";
import assignmentsReducer from "../reducers/AssignmentsReducer";
import themeStyles from "../theme";
import AssignmentTableRow from "./AssignmentTableRow";
import CourseGitlabButton from "./CourseGitlabButton";
import CourseInfoButton from "./CourseInfoButton";
import CreateAssignment from "./CreateAssignment";
import Loading from "./Loading";

const Course = () => {
  const { locationState } = useLocation();
  const { courseId } = useParams();
  let navigate = useNavigate();

  const [state, dispatch] = useReducer(
    assignmentsReducer.reducer,
    assignmentsReducer.initialState
  );

  useEffect(() => {
    async function fetchAll() {
      if (locationState) {
        dispatch({ type: "setCourse", course: locationState.course });
      } else {
        try {
          const course = await courseApi.getCourse(courseId);
          dispatch({ type: "setCourse", course: course });
        } catch (error) {
          console.error(error);
          dispatch({ type: "setCourseError", courseError: error });
        }
      }

      try {
        const assignments = await assignmentApi.getAssignments(courseId);
        dispatch({ type: "setAssignments", assignments: assignments });
      } catch (error) {
        console.error(error);
        dispatch({ type: "setAssignmentsError", assignmentsError: error });
      }
    }

    fetchAll();
  }, [locationState, courseId]);

  return (
    <Flex flexDir="column" w="100%">
      {!state.fetchedCourse || !state.fetchedAssignments ? (
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
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>{state.course.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Flex>
          <Flex m="0 5%" overflowY="auto" flexDir="column" p="0 2rem">
            <Flex alignItems="center" justifyContent="end">
              <Flex>
                <CourseInfoButton
                  courseName={state.course.name}
                  courseDescription={state.course.description}
                />
                <CourseGitlabButton
                  courseGitlabName={state.course.gitlabName}
                />
              </Flex>
            </Flex>
          </Flex>
          <Flex m="0 5%" overflowY="auto" flexDir="column">
            <Table variant="unstyled">
              <TableCaption m={0} placement="top">
                Assignments
              </TableCaption>
              <Thead borderBottom={`2px solid ${themeStyles.color}`}>
                <Tr>
                  <Th>Name</Th>
                  <Th>
                    <Flex alignItems="center" justifyContent="end">
                      <CreateAssignment
                        assignmentsStateDispatch={dispatch}
                        courseId={state.course.id}
                      />
                    </Flex>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {state.assignments
                  .slice(
                    (state.page - 1) * consts.assignmentsPageSize,
                    state.page * consts.assignmentsPageSize
                  )
                  .map((assignment) => (
                    <AssignmentTableRow
                      key={assignment.id}
                      course={state.course}
                      assignment={assignment}
                      assignmentsStateDispatch={dispatch}
                    />
                  ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th></Th>
                  <Th>
                    <Flex alignItems="center" justifyContent="end">
                      <Flex alignItems="center">
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
                    </Flex>
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Course;
