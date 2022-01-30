import {
  Button,
  Flex,
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
import { Field, Form, Formik } from "formik";
import { FiUserMinus } from "react-icons/fi";
import userCourseApi from "../api/usercourse";

export default function DeleteUserCourse({ courseId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function validateUserEmail(value) {
    if (!value) {
      return "User email is required";
    }
  }

  async function createUserCourse(createCourseValues) {
    try {
      await userCourseApi.deleteUserCourse(
        createCourseValues.userEmail,
        courseId
      );

      toast({
        title: "Removed user.",
        description: `Removed user '${createCourseValues.userEmail}'`,
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
          <Formik
            initialValues={{
              userEmail: "",
            }}
            onSubmit={async (values, actions) => {
              await createUserCourse(values);
              actions.setSubmitting(false);
              onClose();
            }}
          >
            {(props) => (
              <Form>
                <ModalHeader>Remove User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex flexDir="column" justifyContent="space-between">
                    <Field name="userEmail" validate={validateUserEmail}>
                      {({ field, form }) => (
                        <FormControl
                          isInvalid={
                            form.errors.userEmail && form.touched.userEmail
                          }
                        >
                          <FormLabel htmlFor="userEmail">User Email</FormLabel>
                          <Input {...field} id="userEmail" />
                          <FormErrorMessage>
                            {form.errors.userEmail}
                          </FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Flex>
                </ModalBody>
                <ModalFooter>
                  <Button
                    colorScheme="teal"
                    mr={3}
                    isLoading={props.isSubmitting}
                    type="submit"
                  >
                    Create
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
