import { IconButton } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Flex, Link, Text } from "@chakra-ui/layout";
import { useContext, useEffect, useReducer } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import { FiArrowLeft, FiArrowRight, FiBook } from "react-icons/fi";
import ThemeContext from "../contexts/ThemeContext";
import courseApi from "../api/course";
import { useNavigate } from "react-router";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Loading from "./Loading";

const Courses = () => {
  const { styles } = useContext(ThemeContext);
  const pageSize = 5;

  const reducer = (state, action) => {
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
          courses: action.courses,
          lastPage: Math.ceil(action.courses.length / pageSize),
          fetched: true,
          error: null,
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
  };

  const initialState = {
    courses: null,
    page: 1,
    lastPage: 1,
    fetched: false,
    error: null,
  };
  const [state, dispatch] = useReducer(reducer, initialState);

  let navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const courses = await courseApi.getCourses();
      dispatch({ type: "setCourse", courses: courses });
    } catch (error) {
      console.error(error);
      dispatch({ type: "setError", error: error });
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // TODO handle error

  return (
    <Flex flexDir="column" w="100%">
      <Flex alignItems="center" marginBottom="1rem" fontSize="2xl">
        <Breadcrumb separator="→">
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Courses</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <Flex m="0 5%" overflowY="auto" flexDir="column" p="2rem">
        {!state.fetched ? (
          <Loading />
        ) : (
          <Table variant="unstyled">
            <TableCaption placement="top">Courses</TableCaption>
            <Thead borderBottom={`2px solid ${styles.colorPrimary}`}>
              <Tr>
                <Th>
                  <Flex alignItems="center" justifyContent="space-between">
                    Name
                    <Flex alignItems="center">
                      <IconButton
                        color="#FFFFFF"
                        disabled={state.page === 1}
                        icon={<FiArrowLeft />}
                        _focus={{ boxShadow: "none" }}
                        _hover={{ backgroundColor: styles.accentLight }}
                        _active={{ backgroundColor: styles.accentDark }}
                        bg={styles.accentLight}
                        onClick={() => {
                          dispatch({ type: "decrementPage" });
                        }}
                      />
                      <Text m="0.5rem">Page {state.page} </Text>
                      <IconButton
                        color="#FFFFFF"
                        disabled={state.page >= state.lastPage}
                        bg={styles.accentLight}
                        icon={<FiArrowRight />}
                        _focus={{ boxShadow: "none" }}
                        _hover={{ backgroundColor: styles.accentLight }}
                        _active={{ backgroundColor: styles.accentDark }}
                        onClick={() => {
                          dispatch({ type: "incrementPage" });
                        }}
                      />
                    </Flex>
                  </Flex>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {state.courses
                .slice((state.page - 1) * pageSize, state.page * pageSize)
                .map((course) => (
                  <Tr
                    borderBottom={`1px solid ${styles.colorPrimary}`}
                    key={course.id}
                  >
                    <Td>
                      <Flex>
                        <Icon
                          color={styles.accentLight}
                          marginRight="1rem"
                          fontSize="2xl"
                          as={FiBook}
                        />
                        <Link
                          onClick={() =>
                            navigate(`/courses/${course.id}`, {
                              state: { course: course },
                            })
                          }
                        >
                          {course.name}
                        </Link>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        )}
      </Flex>
    </Flex>
  );
};

export default Courses;
