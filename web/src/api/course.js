import axios from "axios";

const getCourses = async () => {
  return (
    await axios.get("http://localhost:8080/course", {
      withCredentials: true,
    })
  ).data;
};

const getCourse = async (courseId, callback) => {
  const result = await axios.get(`http://localhost:8080/course/${courseId}`, {
    withCredentials: true,
  });

  return result.data;
};

const courseApi = {
  getCourses,
  getCourse,
};

export default courseApi;
