import { Flex, Text, Link } from "@chakra-ui/layout";
import { Menu, MenuButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { NavLink } from "react-router-dom";

const NavItem = ({ navSize, title, icon, path, location }) => {
  return (
    <Flex
      mt={25}
      flexDir="column"
      w="100%"
      alignItems={navSize === "small" ? "center" : "flex-start"}
      borderLeft={path === location ? "2px solid #FFFFFF" : "2px solid #333333"}
      paddingRight="2px"
    >
      <Menu placement="right">
        <Link
          as={NavLink}
          p={3}
          borderRadius={8}
          _hover={{ textDecor: "none", color: "#FFFFFF" }}
          _focus={{ boxShadow: "none" }}
          w={navSize === "large" && "100%"}
          to={path}
        >
          <MenuButton w="100%">
            <Flex alignItems="center" color={path === location && "#FFFFFF"}>
              <Icon as={icon} fontSize="2xl" />
              <Text ml={5} display={navSize === "small" ? "none" : "flex"}>
                {title}
              </Text>
            </Flex>
          </MenuButton>
        </Link>
      </Menu>
    </Flex>
  );
};

export default NavItem;
