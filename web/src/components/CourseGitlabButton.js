import { IconButton } from "@chakra-ui/react";
import { FiGitlab } from "react-icons/fi";

export default function CourseGitlabButton({ courseGitlabName }) {
  return (
    <IconButton
      colorScheme="blue"
      variant="ghost"
      _focus={{ boxShadow: "none" }}
      fontSize="1.25rem"
      icon={<FiGitlab />}
      onClick={() => {
        window.open(
          `https://${process.env.REACT_APP_GITLAB_HOST}/${process.env.REACT_APP_GROUP_PARENT_NAME}/${courseGitlabName}`,
          "_blank"
        );
      }}
    />
  );
}
