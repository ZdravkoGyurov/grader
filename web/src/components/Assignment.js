import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { IconButton } from "@chakra-ui/button";
import { Badge, Flex, Text } from "@chakra-ui/layout";
import {
  Table,
  TableCaption,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/table";
import { useContext, useEffect, useReducer } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useLocation, useNavigate, useParams } from "react-router";
import assignmentApi from "../api/assignment";
import courseApi from "../api/course";
import submissionApi from "../api/submission";
import ThemeContext from "../contexts/ThemeContext";
import SubmissionResultModal from "./SubmissionResultModal";

const Assignment = () => {
  const { styles } = useContext(ThemeContext);
  const { state } = useLocation();
  const { courseId, assignmentId } = useParams();
  let navigate = useNavigate();

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

  const assignmentReducer = (state, action) => {
    switch (action.type) {
      case "set":
        return {
          assignment: action.assignment || state.assignment,
          fetched: action.fetched || state.fetched,
          error: action.error || state.error,
        };
      default:
        throw new Error("Wrong reducer action type");
    }
  };
  const [assignmentState, assignmentDispatch] = useReducer(assignmentReducer, {
    assignment: null,
    fetched: false,
    error: null,
  });

  const pageSize = 5;
  const submissionsReducer = (state, action) => {
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
      case "set":
        return {
          ...state,
          submissions: action.submissions,
          lastPage: Math.ceil(action.submissions.length / pageSize),
          fetched: action.fetched,
          error: action.error,
        };
      default:
        throw new Error("Wrong reducer action type");
    }
  };
  const [submissionsState, submissionsDispatch] = useReducer(
    submissionsReducer,
    {
      submissions: null,
      fetched: false,
      error: null,
      page: 1,
      lastPage: 1,
    }
  );

  const fetchCourse = async () => {
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
  };

  const fetchAssignment = async () => {
    try {
      const assignment = await assignmentApi.getAssignment(assignmentId);
      assignmentDispatch({
        type: "set",
        assignment: assignment,
        fetched: true,
      });
    } catch (error) {
      console.error(error);
      assignmentDispatch({
        type: "set",
        assignment: null,
        fetched: true,
        error: error,
      });
    }
  };

  const fetchSubmissions = async () => {
    try {
      const submissions = await submissionApi.getSubmissions(assignmentId);
      submissionsDispatch({
        type: "set",
        submissions: submissions,
        fetched: true,
        error: null,
      });
    } catch (error) {
      console.error(error);
      submissionsDispatch({
        type: "set",
        submissions: null,
        fetched: true,
        error: error,
      });
    }
  };

  const setAll = async () => {
    if (state) {
      if (state.course) {
        courseDispatch({ type: "set", course: state.course, fetched: true });
      } else {
        await fetchCourse();
      }
      if (state.assignment) {
        assignmentDispatch({
          type: "set",
          assignment: state.assignment,
          fetched: true,
        });
      } else {
        await fetchAssignment();
      }
    } else {
      await fetchCourse();
      await fetchAssignment();
    }

    await fetchSubmissions();
  };

  const submissionStatusColor = (submissionStatusName) => {
    switch (submissionStatusName) {
      case "Success":
        return "green";
      case "Pending":
        return "yellow";
      case "Fail":
        return "red";
      default:
        return "blue";
    }
  };

  useEffect(() => {
    setAll();
  }, []);

  if (
    !courseState.course ||
    !assignmentState.assignment ||
    !submissionsState.submissions
  ) {
    return <Flex>fetching/error...</Flex>;
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
          <BreadcrumbItem
            onClick={() => navigate(`/courses/${courseState.course.id}`)}
          >
            <BreadcrumbLink>{courseState.course.name}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>{assignmentState.assignment.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      <Flex m="0 5%" overflowY="auto" flexDir="column" p="0 2rem">
        <Flex justifyContent="space-between">
          <Flex flexDir="column">
            <Text fontWeight="bold">GITLAB NAME</Text>
            <Text>{assignmentState.assignment.gitlabName}</Text>
          </Flex>
          <Flex flexDir="column">
            <Text fontWeight="bold">AUTHOR</Text>
            <Text>{assignmentState.assignment.authorEmail}</Text>
          </Flex>
        </Flex>
        <Flex marginTop="1rem" flexDir="column">
          <Text fontWeight="bold">DESCRIPTION</Text>
          <Text>{assignmentState.assignment.description}</Text>
        </Flex>
      </Flex>
      <Flex m="0 5%" overflowY="auto" flexDir="column" p="2rem">
        <Table variant="unstyled">
          <TableCaption placement="top">Submissions</TableCaption>
          <Thead borderBottom={`2px solid ${styles.colorPrimary}`}>
            <Tr>
              <Th>Date</Th>
              <Th>
                <Flex alignItems="center" justifyContent="space-between">
                  Status
                  <Flex alignItems="center">
                    <IconButton
                      variant="ghost"
                      disabled={submissionsState.page === 1}
                      colorScheme="black"
                      icon={<FiArrowLeft />}
                      _focus={{ boxShadow: "none" }}
                      onClick={() => {
                        submissionsDispatch({ type: "decrementPage" });
                      }}
                    />
                    <Text m="0.5rem">Page {submissionsState.page} </Text>
                    <IconButton
                      variant="ghost"
                      disabled={
                        submissionsState.page >= submissionsState.lastPage
                      }
                      colorScheme="black"
                      icon={<FiArrowRight />}
                      _focus={{ boxShadow: "none" }}
                      onClick={() => {
                        submissionsDispatch({ type: "incrementPage" });
                      }}
                    />
                  </Flex>
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {submissionsState.submissions
              .slice(
                (submissionsState.page - 1) * pageSize,
                submissionsState.page * pageSize
              )
              .map((submission, index) => (
                <Tr
                  borderBottom={`1px solid ${styles.colorPrimary}`}
                  key={submission.id}
                >
                  <Td>
                    <SubmissionResultModal submission={submission} />
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={submissionStatusColor(
                        submission.submissionStatusName
                      )}
                    >
                      {submission.submissionStatusName}
                    </Badge>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </Flex>
    </Flex>
  );
};

export default Assignment;
