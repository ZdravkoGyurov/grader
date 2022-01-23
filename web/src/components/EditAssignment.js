import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
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
import { FiEdit } from "react-icons/fi";
import { Field, Form, Formik } from "formik";
import assignmentApi from "../api/assignment";

export default function EditAssignment({
  assignment,
  assignmentsStateDispatch,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function validateName(value) {
    if (!value) {
      return "Name is required";
    }
  }
  function validateDescription(value) {
    if (!value) {
      return "Description is required";
    }
  }

  async function updateAssignment(updateAssignmentValues) {
    try {
      const updatedAssignment = await assignmentApi.updateAssignment(
        assignment.id,
        updateAssignmentValues
      );
      assignmentsStateDispatch({
        type: "updateAssignment",
        assignment: updatedAssignment,
      });

      toast({
        title: "Update assignment successful.",
        description: `Updated assignment '${assignment.name}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update assignment failed.",
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
        icon={<FiEdit />}
        onClick={onOpen}
      ></IconButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Assignment</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              name: assignment.name,
              description: assignment.description,
            }}
            onSubmit={async (values, actions) => {
              await updateAssignment(values);
              actions.setSubmitting(false);
              onClose();
            }}
          >
            {(props) => (
              <Form>
                <ModalBody>
                  <Field name="name" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                      >
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <Input {...field} id="name" />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description" validate={validateDescription}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.description && form.touched.description
                        }
                      >
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Input {...field} id="description" />
                        <FormErrorMessage>
                          {form.errors.description}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Edit
                  </Button>
                  <Button variant="ghost" onClick={onClose}>
                    Close
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
}
