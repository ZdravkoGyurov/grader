import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import { Flex } from "@chakra-ui/layout";
import NotFound from "./NotFound";
import Users from "./Users";
import Courses from "./Courses";
import { useContext } from "react";
import ThemeContext from "../contexts/ThemeContext";
import Course from "./Course";
import Assignment from "./Assignment";
import Submission from "./Submission";

const Main = () => {
  const { styles } = useContext(ThemeContext);

  return (
    <Flex
      backgroundColor={styles.bg}
      color={styles.colorPrimary}
      w="100%"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius="8px"
      p="1rem"
      h="100%"
    >
      <Routes>
        <Route exact strict path="/courses" element={<Courses />} />
        <Route exact strict path="/courses/:courseId" element={<Course />} />
        <Route
          exact
          strict
          path="/courses/:courseId/assignments/:assignmentId"
          element={<Assignment />}
        />
        <Route
          exact
          strict
          path="/courses/:courseId/assignments/:assignmentId/submissions/:submissionId"
          element={<Submission />}
        />
        <Route exact strict path="/users" element={<Users />} />
        <Route exact strict path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Flex>
  );
};

export default Main;
