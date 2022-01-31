import axios from "axios";

async function createUserCourse(userCourse) {
  const response = await axios(`http://localhost:8080/userCourse`, {
    method: "POST",
    withCredentials: true,
    validateStatus: (status) => {
      return true;
    },
    data: userCourse,
  });

  if (response.status !== 201) {
    throw new Error("Create failed.");
  }

  return response.data;
}

async function putUserCourse(userCourse) {
  const response = await axios(`http://localhost:8080/userCourse`, {
    method: "PUT",
    withCredentials: true,
    validateStatus: (status) => {
      return true;
    },
    data: userCourse,
  });

  if (response.status !== 200) {
    throw new Error("Update failed.");
  }

  return response.data;
}

async function getUserCourses(courseId) {
  const response = await axios(
    `http://localhost:8080/userCourse?courseId=${courseId}`,
    {
      method: "GET",
      withCredentials: true,
      validateStatus: (status) => {
        return true;
      },
    }
  );

  return response.data;
}

async function deleteUserCourse(userEmail, courseId) {
  const response = await axios(
    `http://localhost:8080/userCourse?userEmail=${userEmail}&courseId=${courseId}`,
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

const userCourseApi = {
  createUserCourse,
  putUserCourse,
  getUserCourses,
  deleteUserCourse,
};

export default userCourseApi;
