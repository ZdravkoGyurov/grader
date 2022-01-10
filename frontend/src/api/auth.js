import axios from "axios";

const login = () => {
  window.location.href = "http://localhost:8080/login/oauth/github";
};

const getUser = async () => {
  return (
    await axios.get("http://localhost:8080/userInfo", {
      withCredentials: true,
    })
  ).data;
};

const logout = async () => {
  await axios.delete("http://localhost:8080/logout", {
    withCredentials: true,
  });
};

const authApi = { login, getUser, logout };
export default authApi;
