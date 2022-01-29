import { Flex, Icon, Link, Td, Tr } from "@chakra-ui/react";
import { FiBook } from "react-icons/fi";
import DeleteCourse from "./DeleteCourse";
import EditCourse from "./EditCourse";
import { useNavigate } from "react-router";
import themeStyles from "../theme";

export default function CourseTableRow({ course, coursesStateDispatch }) {
  let navigate = useNavigate();

  return (
    <Tr borderBottom={`1px solid ${themeStyles.color}`} key={course.id}>
      <Td>
        <Flex>
          <Icon
            color={themeStyles.bgAccent}
            marginRight="1rem"
            fontSize="xl"
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
