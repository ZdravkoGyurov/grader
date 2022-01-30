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
  deleteUserCourse,
};

export default userCourseApi;
