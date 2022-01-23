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

async function createAssignment(assignment) {
  const response = await axios(`http://localhost:8080/assignment`, {
    method: "POST",
    withCredentials: true,
    validateStatus: (status) => {
      return true;
    },
    data: assignment,
  });

  if (response.status !== 201) {
    throw new Error("Create failed.");
  }

  return response.data;
}

async function updateAssignment(assignmentId, assignment) {
  const response = await axios(
    `http://localhost:8080/assignment/${assignmentId}`,
    {
      method: "PATCH",
      withCredentials: true,
      validateStatus: (status) => {
        return true;
      },
      data: assignment,
    }
  );

  if (response.status !== 200) {
    throw new Error("Update failed.");
  }

  return response.data;
}

async function deleteAssignment(assignmentId) {
  const response = await axios(
    `http://localhost:8080/assignment/${assignmentId}`,
    {
      method: "DELETE",
      withCredentials: true,
      validateStatus: (status) => {
        return true;
      },
    }
  );

  if (response.status !== 204) {
    throw new Error("Delete failed.");
  }
}

const assignmentApi = {
  getAssignments,
  getAssignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};

export default assignmentApi;
