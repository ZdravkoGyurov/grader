import axios from "axios";

const getSubmissions = async (assignmentId) => {
  const result = await axios.get(
    `http://localhost:8080/submission?assignmentId=${assignmentId}`,
    {
      withCredentials: true,
    }
  );

  return result.data;
};

const submissionApi = {
  getSubmissions,
};

export default submissionApi;
