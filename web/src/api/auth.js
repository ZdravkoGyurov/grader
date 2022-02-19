import axios from "axios";

const login = () => {
  window.location.href = `http://${window._env_.GRADER_HOST}/login/oauth/gitlab`;
};

const getUser = async () => {
  return (
    await axios.get(`http://${window._env_.GRADER_HOST}/userInfo`, {
      withCredentials: true,
    })
  ).data;
};

const getUsers = async () => {
  return (
    await axios.get(`http://${window._env_.GRADER_HOST}/user`, {
      withCredentials: true,
    })
  ).data;
};

const patchUserRole = async (userEmail, userRoleName) => {
  const response = await axios(`http://${window._env_.GRADER_HOST}/userInfo`, {
    method: "PATCH",
    withCredentials: true,
    validateStatus: (status) => {
      return true;
    },
    data: {
      email: userEmail,
      roleName: userRoleName,
    },
  });

  if (response.status !== 200) {
    throw new Error("Update failed.");
  }

  return response.data;
};

const logout = async () => {
  await axios.delete(`http://${window._env_.GRADER_HOST}/logout`, {
    withCredentials: true,
  });
};

const authApi = { login, getUser, getUsers, patchUserRole, logout };
export default authApi;
