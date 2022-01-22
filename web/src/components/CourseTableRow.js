import { Flex, Icon, Link, Td, Tr } from "@chakra-ui/react";
import { useContext } from "react";
import { FiBook } from "react-icons/fi";
import ThemeContext from "../contexts/ThemeContext";
import DeleteCourse from "./DeleteCourse";
import EditCourse from "./EditCourse";
import { useNavigate } from "react-router";

export default function CourseTableRow({ course, coursesStateDispatch }) {
  const { styles } = useContext(ThemeContext);
  let navigate = useNavigate();

  return (
    <Tr borderBottom={`1px solid ${styles.colorPrimary}`} key={course.id}>
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
      <Td>
        <Flex justifyContent="end">
          <EditCourse
            course={course}
            coursesStateDispatch={coursesStateDispatch}
          />
          <DeleteCourse
            course={course}
            coursesStateDispatch={coursesStateDispatch}
          />
        </Flex>
      </Td>
    </Tr>
  );
}
