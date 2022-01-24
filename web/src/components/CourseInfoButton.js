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

export default function CourseInfoButton({ courseName, courseDescription }) {
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
          <ModalHeader>{courseName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{courseDescription}</ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
