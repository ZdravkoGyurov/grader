import { Avatar } from "@chakra-ui/avatar";
import { IconButton } from "@chakra-ui/button";
import { Badge, Divider, Flex, Heading } from "@chakra-ui/layout";
import { useContext, useState } from "react";
import { FiMenu, FiUsers, FiBook } from "react-icons/fi";
import { useLocation } from "react-router";
import consts from "../consts";
import ThemeContext from "../contexts/ThemeContext";
import UserContext from "../contexts/UserContext";
import NavItem from "./NavItem";

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const { styles } = useContext(ThemeContext);

  const getNavSize = () => {
    let _navSize = localStorage.getItem("navSize");
    if (!_navSize || (_navSize !== "small" && _navSize !== "large")) {
      _navSize = "small";
      localStorage.setItem("navSize", _navSize);
    }

    return _navSize;
  };

  const [navSize, setNavSize] = useState(getNavSize());
  const _setNavSize = (_navSize) => {
    setNavSize(_navSize);
    localStorage.setItem("navSize", _navSize);
  };
  let location = useLocation();

  return (
    <Flex
      position="sticky"
      marginRight="0.5rem"
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      borderRadius="8px"
      flexDir="column"
      justifyContent="space-between"
      backgroundColor="#333333"
      color={styles.colorSecondary}
    >
      <Flex
        paddingLeft="0.5rem"
        paddingRight="0.5rem"
        flexDir="column"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        as="nav"
      >
        <Flex
          w={navSize !== "small" && "100%"}
          mt={5}
          alignItems="center"
          justifyContent="space-between"
          paddingRight={navSize === "large" && "0.75rem"}
        >
          <IconButton
            background="none"
            _hover={{ background: "none", color: "#FFFFFF" }}
            _focus={{ boxShadow: "none" }}
            _active={{ backgroundColor: "#333333" }}
            icon={<FiMenu />}
            onClick={() => {
              navSize === "small" ? _setNavSize("large") : _setNavSize("small");
            }}
            paddingLeft={navSize === "large" && "0.75rem"}
            borderLeft="2px solid #333333"
            borderRight="2px solid #333333"
          ></IconButton>
        </Flex>
        <NavItem
          navSize={navSize}
          icon={FiBook}
          title="Courses"
          path={
            location.pathname.startsWith("/courses")
              ? location.pathname
              : "/courses"
          }
          location={location.pathname}
        ></NavItem>
        <NavItem
          navSize={navSize}
          icon={FiUsers}
          title="Users"
          path="/users"
          location={location.pathname}
        ></NavItem>
      </Flex>
      <Flex
        paddingLeft="1rem"
        paddingRight="1rem"
        flexDir="column"
        w="100%"
        alignItems={navSize === "small" ? "center" : "flex-start"}
        mb={4}
        color="#FFFFFF"
      >
        <Divider display={navSize === "small" ? "none" : "flex"} />
        <Flex mt={4} alignItems="center" justifyContent="left">
          <Avatar marginBottom="0.8rem" size="sm" src={user.avatarUrl} />
          <Flex
            flexDir="column"
            ml={4}
            display={navSize === "small" ? "none" : "flex"}
          >
            <Heading as="h3" size="sm">
              {user.email}
            </Heading>
            <Badge marginTop="0.5rem" w="max-content" colorScheme="blue">
              {consts.roles[user.roleId]}
            </Badge>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
