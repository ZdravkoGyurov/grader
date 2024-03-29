import {
  Badge,
  Flex,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

export default function SubmissionResultModal({ submission }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const submissionStatusColor = (submissionStatusName) => {
    switch (submissionStatusName) {
      case "Success":
        return "green";
      case "Pending":
        return "yellow";
      case "Fail":
        return "red";
      default:
        return "teal";
    }
  };

  return (
    <>
      <Link onClick={onOpen}>{submission.points}</Link>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex alignItems="center">
              <Badge
                fontSize="1rem"
                colorScheme={submissionStatusColor(
                  submission.submissionStatusName
                )}
              >
                {submission.submissionStatusName}
              </Badge>
              <Text ml="1rem">
                {new Date(submission.submittedOn).toLocaleString()}
              </Text>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {submission.result.split("\n").map((resultLine, index) => (
              <Text m="0.25rem" key={index}>
                {resultLine}
              </Text>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
