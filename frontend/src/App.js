import "./App.css";
import { Flex } from "@chakra-ui/layout";
import Sidebar from "./components/Sidebar";
import Main from "./components/Main";
import { useEffect, useState } from "react";
import themeStyles from "./theme";
import Home from "./components/Home";
import Header from "./components/Header";
import UserContext from "./contexts/UserContext";
import ThemeContext from "./contexts/ThemeContext";
import authApi from "./api/auth";

const getTheme = () => {
  let theme = localStorage.getItem("theme");
  if (!theme || (theme !== "light" && theme !== "dark")) {
    theme = "light";
    localStorage.setItem("theme", theme);
  }

  return theme;
};

const App = () => {
  const [theme, _setTheme] = useState(getTheme());
  const setTheme = (theme) => {
    _setTheme(theme);
    localStorage.setItem("theme", theme);
  };

  const [user, setUser] = useState(null);
  const [fetchingUser, setFetchingUser] = useState(true);

  const fetchUser = async () => {
    setFetchingUser(true);
    try {
      const user = await authApi.getUser();
      setUser(user);
    } catch (error) {
      console.error(error);
      setUser(null);
    }
    setFetchingUser(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (fetchingUser) {
    // add loading page
    return <div>loading...</div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider
        value={{ theme, setTheme, styles: themeStyles(theme) }}
      >
        <Flex backgroundColor="#F3F3F3" h="100vh" p="0.5rem">
          {user ? (
            <>
              <Sidebar />
              <Flex w="100%" flexDir="column">
                <Header />
                <Main />
              </Flex>
            </>
          ) : (
            <Home></Home>
          )}
        </Flex>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

export default App;
