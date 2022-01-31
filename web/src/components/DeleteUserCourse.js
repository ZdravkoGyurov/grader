import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiUserMinus } from "react-icons/fi";
import userCourseApi from "../api/usercourse";
import courseUsersReducer from "../reducers/CourseUsersReducer";

export default function DeleteUserCourse({
  courseUsersDispatch,
  userEmail,
  courseId,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [fetching, setFetching] = useState(false);

  async function deleteUserCourse() {
    setFetching(true);
    try {
      await userCourseApi.deleteUserCourse(userEmail, courseId);
      courseUsersDispatch({
        type: courseUsersReducer.deleteCourseUsersAction,
        userEmail: userEmail,
      });

      toast({
        title: "Removed user.",
        description: `Removed user '${userEmail}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Remove user failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    setFetching(false);
    onClose();
  }

  return (
    <>
      <IconButton
        variant="ghost"
        _focus={{ boxShadow: "none" }}
        icon={<FiUserMinus />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Remove User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Remove user {userEmail}?</ModalBody>
          <ModalFooter>
            <Button
              isLoading={fetching}
              colorScheme="teal"
              mr={3}
              type="submit"
              onClick={() => {
                deleteUserCourse();
              }}
            >
              Remove
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
