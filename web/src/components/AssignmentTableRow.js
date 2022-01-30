import { Flex, Icon, Link, Td, Tr } from "@chakra-ui/react";
import { FiCode } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import themeStyles from "../theme";
import DeleteAssignment from "./DeleteAssignment";
import EditAssignment from "./EditAssignment";

export default function AssignmentTableRow({
  assignmentsStateDispatch,
  course,
  assignment,
}) {
  let navigate = useNavigate();

  return (
    <Tr borderBottom={`1px solid ${themeStyles.color}`} key={assignment.id}>
      <Td p="0.5rem">
        <Flex>
          <Icon
            color={themeStyles.bgAccent}
            marginRight="1rem"
            fontSize="2xl"
            as={FiCode}
          />
          <Link
            onClick={() =>
              navigate(`/courses/${course.id}/assignments/${assignment.id}`, {
                state: {
                  course: course,
                  assignment: assignment,
                },
              })
            }
          >
            {assignment.name}
          </Link>
        </Flex>
      </Td>
      <Td p="0.5rem">
        <Flex justifyContent="end">
          <EditAssignment
            assignment={assignment}
            assignmentsStateDispatch={assignmentsStateDispatch}
          />
          <DeleteAssignment
            assignment={assignment}
            assignmentsStateDispatch={assignmentsStateDispatch}
          />
        </Flex>
      </Td>
    </Tr>
  );
}
