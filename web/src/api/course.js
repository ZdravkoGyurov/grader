import axios from "axios";

async function getCourses() {
  return (
    await axios.get("http://localhost:8080/course", {
      withCredentials: true,
    })
  ).data;
}

async function getCourse(courseId) {
  const result = await axios.get(`http://localhost:8080/course/${courseId}`, {
    withCredentials: true,
  });

  return result.data;
}

async function createCourse(course) {
  const response = await axios(`http://localhost:8080/course`, {
    method: "POST",
    withCredentials: true,
    validateStatus: (status) => {
      return true;
    },
    data: course,
  });

  if (response.status !== 201) {
    throw new Error("Update failed.");
  }

  return response.data;
}

async function updateCourse(courseId, course) {
  const response = await axios(`http://localhost:8080/course/${courseId}`, {
    method: "PATCH",
    withCredentials: true,
    validateStatus: (status) => {
      return true;
    },
    data: course,
  });

  if (response.status !== 200) {
    throw new Error("Update failed.");
  }

  return response.data;
}

async function deleteCourse(courseId) {
  const response = await axios(`http://localhost:8080/course/${courseId}`, {
    method: "DELETE",
    withCredentials: true,
    validateStatus: (status) => {
      return true;
    },
  });

  if (response.status !== 204) {
    throw new Error("Delete failed.");
  }
}

const courseApi = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};

export default courseApi;
