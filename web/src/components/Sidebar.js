import { Avatar } from "@chakra-ui/avatar";
import { IconButton } from "@chakra-ui/button";
import { Badge, Divider, Flex, Text } from "@chakra-ui/layout";
import { useContext, useState } from "react";
import { FiMenu, FiUsers, FiBook } from "react-icons/fi";
import { useLocation } from "react-router";
import UserContext from "../contexts/UserContext";
import themeStyles from "../theme";
import NavItem from "./NavItem";

const Sidebar = () => {
  const { user } = useContext(UserContext);

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
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      flexDir="column"
      justifyContent="space-between"
      backgroundColor={themeStyles.bgSidebar}
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
            _hover={{ background: "none" }}
            _focus={{ boxShadow: "none" }}
            _active={{ background: "none" }}
            icon={<FiMenu />}
            onClick={() => {
              navSize === "small" ? _setNavSize("large") : _setNavSize("small");
            }}
            paddingLeft={navSize === "large" && "0.75rem"}
            border="none"
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
          path={
            location.pathname.startsWith("/users")
              ? location.pathname
              : "/users"
          }
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
      >
        <Divider
          borderColor={themeStyles.bgHeader}
          display={navSize === "small" ? "none" : "flex"}
        />
        <Flex mt={4} alignItems="center" justifyContent="left">
          <Avatar
            border={`1px solid ${themeStyles.bgHeader}`}
            marginBottom="0.8rem"
            size="sm"
            src={user.avatarUrl}
          />
          <Flex
            flexDir="column"
            ml={4}
            display={navSize === "small" ? "none" : "flex"}
          >
            <Text fontSize="sm">{user.name}</Text>
            <Badge marginTop="0.5rem" w="max-content">
              {user.roleName}
            </Badge>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
