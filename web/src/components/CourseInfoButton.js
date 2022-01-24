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
import options from "../consts/markdown";
import Markdown from "markdown-to-jsx";

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

      <Modal size="4xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{courseName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Markdown children={courseDescription} options={options} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
