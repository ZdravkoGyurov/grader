import { Button } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import { FiGithub } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import UserContext from "../contexts/UserContext";
import ThemeContext from "../contexts/ThemeContext";
import authApi from "../api/auth";

const Home = () => {
  const { user } = useContext(UserContext);
  const { styles } = useContext(ThemeContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/courses");
    }
  }, [user, navigate]);

  return (
    <Flex
      backgroundColor="#F3F3F3"
      color="#FFFFFF"
      alignItems="center"
      justifyContent="center"
      w="100%"
    >
      <Button
        backgroundColor={styles.accentLight}
        _hover={{ backgroundColor: "none", color: "#FFFFFF" }}
        _focus={{ boxShadow: "none" }}
        _active={{ backgroundColor: styles.accentDark }}
        leftIcon={<FiGithub />}
        variant="solid"
        onClick={() => {
          authApi.login();
        }}
      >
        Continue with Github
      </Button>
    </Flex>
  );
};

export default Home;
