import { Route, Routes } from "react-router-dom";
import Home from "./Home";
import { Flex } from "@chakra-ui/layout";
import NotFound from "./NotFound";
import Users from "./Users";
import Courses from "./Courses";
import Course from "./Course";
import Assignment from "./Assignment";
import Sidebar from "./Sidebar";
import CourseUsers from "./CourseUsers";

const Main = () => {
  return (
    <Flex w="100%" boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)" h="100%">
      <Sidebar />
      <Flex p=".5rem 1rem" h="100%" w="100%">
        <Routes>
          <Route exact strict path="/courses" element={<Courses />} />
          <Route exact strict path="/courses/:courseId" element={<Course />} />
          <Route
            exact
            strict
            path="/courses/:courseId/assignments/:assignmentId"
            element={<Assignment />}
          />
          <Route exact strict path="/users" element={<Users />} />
          <Route
            exact
            strict
            path="/users/:courseId"
            element={<CourseUsers />}
          />
          <Route exact strict path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Flex>
    </Flex>
  );
};

export default Main;
