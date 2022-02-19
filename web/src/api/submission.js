import axios from "axios";

const getSubmissions = async (assignmentId) => {
  const result = await axios.get(
    `http://${window._env_.GRADER_HOST}/submission?assignmentId=${assignmentId}`,
    {
      withCredentials: true,
    }
  );

  return result.data;
};

async function createSubmission(assignmentId) {
  const response = await axios(`http://${window._env_.GRADER_HOST}/submission`, {
    method: "POST",
    withCredentials: true,
    validateStatus: (status) => {
      return true;
    },
    data: {
      assignmentId,
    },
  });

  if (response.status !== 202) {
    throw new Error("Create submission failed.");
  }

  return response.data;
}

const submissionApi = {
  getSubmissions,
  createSubmission,
};

export default submissionApi;
