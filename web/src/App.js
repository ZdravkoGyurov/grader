import "./App.css";
import { Flex } from "@chakra-ui/layout";
import Main from "./components/Main";
import { useEffect, useState } from "react";
import themeStyles from "./theme";
import Home from "./components/Home";
import Header from "./components/Header";
import UserContext from "./contexts/UserContext";
import authApi from "./api/auth";
import Loading from "./components/Loading";

const App = () => {
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
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Flex
        color={themeStyles.color}
        backgroundColor={themeStyles.bg}
        h="100vh"
      >
        <Flex w="100%" flexDir="column">
          <Header />
          { user ? <Main /> : <Home /> }
        </Flex>
      </Flex>
    </UserContext.Provider>
  );
};

export default App;
