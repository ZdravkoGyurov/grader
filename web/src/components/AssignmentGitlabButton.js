import { IconButton } from "@chakra-ui/react";
import { useContext } from "react";
import { FiGitlab } from "react-icons/fi";
import UserContext from "../contexts/UserContext";

export default function AssignmentGitlabButton({
  courseGitlabName,
  assignmentGitlabName,
}) {
  const { user } = useContext(UserContext);
  return (
    <IconButton
      colorScheme="teal"
      variant="ghost"
      _focus={{ boxShadow: "none" }}
      fontSize="1.25rem"
      icon={<FiGitlab />}
      onClick={() => {
        window.open(
          `https://${process.env.REACT_APP_GITLAB_HOST}/${process.env.REACT_APP_GROUP_PARENT_NAME}/${courseGitlabName}/${user.name}/-/tree/main/${assignmentGitlabName}`,
          "_blank"
        );
      }}
    />
  );
}
