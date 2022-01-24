import {
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";

export default function AssignmentInfoButton({
  assignmentName,
  assignmentDescription,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <IconButton
        colorScheme="blue"
        variant="ghost"
        _focus={{ boxShadow: "none" }}
        fontSize="1.25rem"
        icon={<FiInfo />}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{assignmentName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{assignmentDescription}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
