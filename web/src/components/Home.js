import { Button } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import { FiGitlab } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import authApi from "../api/auth";
import themeStyles from "../theme";

const Home = () => {
  const { user } = useContext(UserContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/courses");
    }
  }, [user, navigate]);

  return (
    <Flex
      backgroundColor={themeStyles.bg}
      alignItems="center"
      justifyContent="center"
      w="100%"
      h="100%"
    >
      <Button
        colorScheme="teal"
        leftIcon={<FiGitlab />}
        onClick={() => {
          authApi.login();
        }}
      >
        Continue with Gitlab
      </Button>
    </Flex>
  );
};

export default Home;
