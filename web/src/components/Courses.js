import { IconButton } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { useContext, useEffect, useReducer } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableCaption,
  Tfoot,
} from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import ThemeContext from "../contexts/ThemeContext";
import courseApi from "../api/course";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Loading from "./Loading";
import CourseTableRow from "./CourseTableRow";
import CreateCourse from "./CreateCourse";
import coursesReducer from "../reducers/CoursesReducer";
import consts from "../consts/consts";

const Courses = () => {
  const { styles } = useContext(ThemeContext);

  const [state, dispatch] = useReducer(
    coursesReducer.reducer,
    coursesReducer.initialState
  );

  useEffect(() => {
    async function fetchCourses() {
      try {
        const courses = await courseApi.getCourses();
        dispatch({ type: "setCourses", courses: courses });
      } catch (error) {
        console.error(error);
        dispatch({ type: "setError", error: error });
      }
    }
    fetchCourses();
  }, []);

  // TODO handle error

  return (
    <Flex flexDir="column" w="100%">
      {!state.fetched ? (
        <Loading />
      ) : (
        <Flex flexDir="column">
          <Flex alignItems="center" marginBottom="1rem" fontSize="2xl">
            <Breadcrumb separator="→">
              <BreadcrumbItem isCurrentPage>
                <BreadcrumbLink>Courses</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
          </Flex>
          <Flex m="0 5%" overflowY="auto" flexDir="column" p="2rem">
            <Table variant="unstyled">
              <TableCaption m={0} placement="top">
                Courses
              </TableCaption>
              <Thead borderBottom={`2px solid ${styles.colorPrimary}`}>
                <Tr>
                  <Th>Name</Th>
                  <Th>
                    <Flex alignItems="center" justifyContent="end">
                      <CreateCourse coursesStateDispatch={dispatch} />
                    </Flex>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {state.courses
                  .slice(
                    (state.page - 1) * consts.coursesPageSize,
                    state.page * consts.coursesPageSize
                  )
                  .map((course) => (
                    <CourseTableRow
                      key={course.id}
                      course={course}
                      coursesStateDispatch={dispatch}
                    />
                  ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th></Th>
                  <Th>
                    <Flex alignItems="center" justifyContent="end">
                      <IconButton
                        variant="ghost"
                        disabled={state.page === 1}
                        colorScheme="black"
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
                        colorScheme="black"
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
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default Courses;
