import { IconButton } from "@chakra-ui/react";
import { FiGitlab } from "react-icons/fi";

export default function CoursesGitlabButton() {
  return (
    <IconButton
      colorScheme="teal"
      variant="ghost"
      _focus={{ boxShadow: "none" }}
      fontSize="1.25rem"
      icon={<FiGitlab />}
      onClick={() => {
        window.open(
          `https://${process.env.REACT_APP_GITLAB_HOST}/${process.env.REACT_APP_GROUP_PARENT_NAME}`,
          "_blank"
        );
      }}
    />
  );
}
