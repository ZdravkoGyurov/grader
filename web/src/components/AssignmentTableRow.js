import { Flex, Icon, Link, Td, Tr } from "@chakra-ui/react";
import { useContext } from "react";
import { FiCode } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ThemeContext from "../contexts/ThemeContext";
import DeleteAssignment from "./DeleteAssignment";
import EditAssignment from "./EditAssignment";

export default function AssignmentTableRow({
  assignmentsStateDispatch,
  course,
  assignment,
}) {
  const { styles } = useContext(ThemeContext);
  let navigate = useNavigate();

  return (
    <Tr borderBottom={`1px solid ${styles.colorPrimary}`} key={assignment.id}>
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
      <Td>
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
