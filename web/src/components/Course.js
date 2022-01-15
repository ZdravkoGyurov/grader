import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { IconButton } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Flex, Link, Text } from "@chakra-ui/layout";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import { useContext, useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiCode } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router";
import assignmentApi from "../api/assignment";
import courseApi from "../api/course";
import ThemeContext from "../contexts/ThemeContext";

const Course = () => {
  const { styles } = useContext(ThemeContext);
  const { state } = useLocation();

  const [course, setCourse] = useState(null);
  const [fetchedCourse, setFetchedCourse] = useState(false);

  const pageSize = 5;
  const [assignments, setAssignments] = useState([]);
  const [fetchedAssignments, setFetchedAssignments] = useState(false);
  const [page, setPage] = useState(1);
  const [maxPageSize, setMaxPageSize] = useState(1);
  const { courseId } = useParams();

  let navigate = useNavigate();

  const fetchAll = async () => {
    if (state) {
      setCourse(state.course);
      setFetchedCourse(true);
    } else {
      try {
        const course = await courseApi.getCourse(courseId);
        setCourse(course);
      } catch (error) {
        console.error(error);
        setCourse(null);
      }
      setFetchedCourse(true);
    }

    try {
      const assignments = await assignmentApi.getAssignments(courseId);
      setAssignments(assignments);
    } catch (error) {
      console.error(error);
      setAssignments(null);
    }
    setFetchedAssignments(true);

    setMaxPageSize(Math.ceil(assignments.length / pageSize));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (!fetchedCourse || !fetchedAssignments) {
    return <Flex>fetching...</Flex>;
  }

  return (
    <Flex flexDir="column" w="100%">
      <Flex alignItems="center" marginBottom="1rem" fontSize="2xl">
        <Breadcrumb separator="→">
          <BreadcrumbItem>
            <BreadcrumbLink onClick={() => navigate(`/courses`)}>
              Courses
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{course.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <Flex m="0 5%" overflowY="auto" flexDir="column" p="0 2rem">
        <Flex justifyContent="space-between">
          <Flex flexDir="column">
            <Text fontWeight="bold">GITHUB NAME</Text>
            <Text>{course.githubName}</Text>
          </Flex>
          <Flex flexDir="column">
            <Text fontWeight="bold">CREATED BY</Text>
            <Text>{course.creatorEmail}</Text>
          </Flex>
        </Flex>
        <Flex marginTop="1rem" flexDir="column">
          <Text fontWeight="bold">DESCRIPTION</Text>
          <Text>{course.description}</Text>
        </Flex>
      </Flex>
      <Flex m="0 5%" overflowY="auto" flexDir="column" p="2rem">
        <Table variant="unstyled">
          <TableCaption placement="top">Assignments</TableCaption>
          <Thead borderBottom={`2px solid ${styles.colorPrimary}`}>
            <Tr>
              <Th>
                <Flex alignItems="center" justifyContent="space-between">
                  Name
                  <Flex alignItems="center">
                    <IconButton
                      color="#FFFFFF"
                      disabled={page === 1}
                      icon={<FiArrowLeft />}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ backgroundColor: styles.accentLight }}
                      _active={{ backgroundColor: styles.accentDark }}
                      bg={styles.accentLight}
                      onClick={() => {
                        if (page > 1) setPage(page - 1);
                      }}
                    />
                    <Text m="0.5rem">Page {page} </Text>
                    <IconButton
                      color="#FFFFFF"
                      disabled={page >= maxPageSize}
                      bg={styles.accentLight}
                      icon={<FiArrowRight />}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ backgroundColor: styles.accentLight }}
                      _active={{ backgroundColor: styles.accentDark }}
                      onClick={() => {
                        if (page < maxPageSize) setPage(page + 1);
                      }}
                    />
                  </Flex>
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {assignments
              .slice((page - 1) * pageSize, page * pageSize)
              .map((assignment) => (
                <Tr
                  borderBottom={`1px solid ${styles.colorPrimary}`}
                  key={assignment.id}
                >
                  <Td>
                    <Flex>
                      <Icon
                        color={styles.accentLight}
                        marginRight="1rem"
                        fontSize="2xl"
                        as={FiCode}
                      />
                      <Link
                        onClick={() =>
                          navigate(
                            `/courses/${course.id}/assignments/${assignment.id}`,
                            {
                              state: { course: course, assignment: assignment },
                            }
                          )
                        }
                      >
                        {assignment.name}
                      </Link>
                    </Flex>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
};

export default Course;
