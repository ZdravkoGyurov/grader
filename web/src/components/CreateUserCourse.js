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
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { FiUserPlus } from "react-icons/fi";
import userCourseApi from "../api/usercourse";

export default function CreateUserCourse({ courseId }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function validateUserEmail(value) {
    if (!value) {
      return "User email is required";
    }
  }

  function validateCourseRoleName(value) {
    if (!value) {
      return "Course role name is required";
    }
    if (value !== "Student" && value !== "Assistant") {
      return "Course role can be either Student or Assistant";
    }
  }

  async function createUserCourse(createCourseValues) {
    try {
      createCourseValues.courseId = courseId;
      await userCourseApi.createUserCourse(createCourseValues);

      toast({
        title: "Added user.",
        description: `Added user '${createCourseValues.userEmail}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Add user failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Button colorScheme="teal" leftIcon={<FiUserPlus />} onClick={onOpen}>
        Add User
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{
              userEmail: "",
              courseRoleName: "Student",
            }}
            onSubmit={async (values, actions) => {
              await createUserCourse(values);
              actions.setSubmitting(false);
              onClose();
            }}
          >
            {(props) => (
              <Form>
                <ModalHeader>Add User</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex flexDir="column" justifyContent="space-between">
                    <Flex>
                      <Field name="userEmail" validate={validateUserEmail}>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.userEmail && form.touched.userEmail
                            }
                          >
                            <FormLabel htmlFor="userEmail">
                              User Email
                            </FormLabel>
                            <Input {...field} id="userEmail" />
                            <FormErrorMessage>
                              {form.errors.userEmail}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Flex>
                    <Flex>
                      <Field
                        name="courseRoleName"
                        validate={validateCourseRoleName}
                      >
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.courseRoleName &&
                              form.touched.courseRoleName
                            }
                          >
                            <FormLabel htmlFor="courseRoleName">
                              Course Role
                            </FormLabel>
                            <Select id="courseRoleName" {...field}>
                              <option value="Student">Student</option>
                              <option value="Assistant">Assistant</option>
                            </Select>
                            <FormErrorMessage>
                              {form.errors.courseRoleName}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Flex>
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
