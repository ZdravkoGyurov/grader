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
import { FiTrash2 } from "react-icons/fi";
import courseApi from "../api/course";

export default function DeleteCourse({ course, coursesStateDispatch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  async function deleteCourse() {
    try {
      await courseApi.deleteCourse(course.id);
      coursesStateDispatch({ type: "deleteCourse", courseId: course.id });
      toast({
        title: "Delete course successful.",
        description: `Deleted course '${course.name}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete course failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <IconButton
        variant="ghost"
        colorScheme="black"
        _focus={{ boxShadow: "none" }}
        icon={<FiTrash2 />}
        onClick={onOpen}
      ></IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Course</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete course '{course.name}'?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                deleteCourse();
              }}
            >
              Delete
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
