import axios from "axios";

const login = () => {
  window.location.href = "http://localhost:8080/login/oauth/gitlab";
};

const getUser = async () => {
  return (
    await axios.get("http://localhost:8080/userInfo", {
      withCredentials: true,
    })
  ).data;
};

const getUsers = async () => {
  return (
    await axios.get("http://localhost:8080/user", {
      withCredentials: true,
    })
  ).data;
};

const patchUserRole = async (userEmail, userRoleName) => {
  const response = await axios(`http://localhost:8080/userInfo`, {
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
  await axios.delete("http://localhost:8080/logout", {
    withCredentials: true,
  });
};

const authApi = { login, getUser, getUsers, patchUserRole, logout };
export default authApi;
