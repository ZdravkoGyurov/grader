import { Button } from "@chakra-ui/button";
import { Flex, Text } from "@chakra-ui/layout";
import { useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";
import authApi from "../api/auth";
import UserContext from "../contexts/UserContext";
import themeStyles from "../theme";

const Header = () => {
  const { user, setUser } = useContext(UserContext);

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
      bg={themeStyles.bgHeader}
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      justifyContent="space-between"
      alignItems="center"
      p=".5rem 1rem"
    >
      <Text fontSize="3xl">sukao</Text>
      { user ? (
        <Flex alignItems="center">
          <Button
            marginLeft="1rem"
            colorScheme="-"
            _focus={{ boxShadow: "none" }}
            leftIcon={<FiLogOut />}
            variant="ghost"
            onClick={() => {
              handleLogout();
            }}
          >
            Logout
          </Button>
        </Flex>
      ) : null }
    </Flex>
  );
};

export default Header;
