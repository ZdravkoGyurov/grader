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
import assignmentApi from "../api/assignment";

export default function DeleteAssignment({
  assignment,
  assignmentsStateDispatch,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  async function deleteAssignment() {
    try {
      await assignmentApi.deleteAssignment(assignment.id);
      assignmentsStateDispatch({
        type: "deleteAssignment",
        assignmentId: assignment.id,
      });
      toast({
        title: "Delete assignment successful.",
        description: `Deleted assignment '${assignment.name}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Delete assignment failed.",
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
          <ModalHeader>Delete Assignment</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete assignment '{assignment.name}'?
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                deleteAssignment();
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
