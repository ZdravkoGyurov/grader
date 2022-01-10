import axios from "axios";

const getAssignments = async (courseId) => {
  const result = await axios.get(
    `http://localhost:8080/assignment?courseId=${courseId}`,
    {
      withCredentials: true,
    }
  );

  return result.data;
};

const getAssignment = async (assignmentId) => {
  const result = await axios.get(
    `http://localhost:8080/assignment/${assignmentId}`,
    {
      withCredentials: true,
    }
  );

  return result.data;
};

const assignmentApi = {
  getAssignments,
  getAssignment,
};

export default assignmentApi;
