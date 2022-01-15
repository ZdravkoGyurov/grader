import { Button } from "@chakra-ui/button";
import Icon from "@chakra-ui/icon";
import { Flex, Text } from "@chakra-ui/layout";
import { useContext } from "react";
import { FiLogOut, FiMoon, FiSun } from "react-icons/fi";
import { useNavigate } from "react-router";
import authApi from "../api/auth";
import ThemeContext from "../contexts/ThemeContext";
import UserContext from "../contexts/UserContext";

const Header = () => {
  const { theme, setTheme, styles } = useContext(ThemeContext);
  const { setUser } = useContext(UserContext);

  let navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Flex
      borderRadius="8px"
      color={styles.colorPrimary}
      bg={styles.bg}
      marginBottom="0.5rem"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      justifyContent="space-between"
      alignItems="center"
      p="1rem"
    >
      <Text fontSize="3xl">Grader.io</Text>
      <Flex alignItems="center">
        <Icon
          color={styles.colorSecondary}
          _hover={{
            background: "none",
            color: styles.colorPrimary,
            cursor: "pointer",
          }}
          _focus={{ boxShadow: "none" }}
          _active={{ backgroundColor: styles.bg }}
          as={theme === "light" ? FiMoon : FiSun}
          fontSize="2xl"
          onClick={() => {
            theme === "light" ? setTheme("dark") : setTheme("light");
          }}
        />
        <Button
          marginLeft="1rem"
          color="#FFFFFF"
          backgroundColor={styles.accentLight}
          _hover={{ backgroundColor: styles.accentLight }}
          _focus={{ boxShadow: "none" }}
          _active={{ backgroundColor: styles.accentDark }}
          leftIcon={<FiLogOut />}
          variant="solid"
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
