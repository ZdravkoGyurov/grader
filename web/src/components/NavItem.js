import { Flex, Text, Link } from "@chakra-ui/layout";
import { Menu, MenuButton } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icon";
import { NavLink } from "react-router-dom";
import themeStyles from "../theme";

const NavItem = ({ navSize, title, icon, path, location }) => {
  return (
    <Flex
      mt={25}
      flexDir="column"
      w="100%"
      alignItems={navSize === "small" ? "center" : "flex-start"}
      borderLeft={
        path === location
          ? `2px solid ${themeStyles.color}`
          : `2px solid ${themeStyles.bgSidebar}`
      }
      paddingRight="2px"
    >
      <Menu placement="right">
        <Link
          as={NavLink}
          p={3}
          borderRadius={8}
          _hover={{ textDecor: "none", color: themeStyles.color }}
          _focus={{ boxShadow: "none" }}
          w={navSize === "large" && "100%"}
          to={path}
        >
          <MenuButton w="100%">
            <Flex alignItems="center">
              <Icon as={icon} fontSize="2xl" />
              <Text
                ml={5}
                fontSize="md"
                display={navSize === "small" ? "none" : "flex"}
                fontWeight={path === location ? "bold" : "none"}
              >
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
