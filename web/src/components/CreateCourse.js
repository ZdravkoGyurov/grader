import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
import courseApi from "../api/course";

export default function CreateCourse({ coursesStateDispatch }) {
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

  function validateGitlabName(value) {
    if (!value) {
      return "Gitlab Name is required";
    }
  }

  async function createCourse(createCourseValues) {
    try {
      const createdCourse = await courseApi.createCourse(createCourseValues);
      coursesStateDispatch({ type: "createCourse", course: createdCourse });

      toast({
        title: "Create course successful.",
        description: `Created course '${createCourseValues.name}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Create course failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Create
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{
              name: "",
              description: "",
              gitlabName: "",
            }}
            onSubmit={async (values, actions) => {
              await createCourse(values);
              actions.setSubmitting(false);
              onClose();
            }}
          >
            {(props) => (
              <Form>
                <ModalHeader>Create Course</ModalHeader>
                <ModalCloseButton />
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
                  <Field name="gitlabName" validate={validateGitlabName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.gitlabName && form.touched.gitlabName
                        }
                      >
                        <FormLabel htmlFor="gitlabName">Gitlab Name</FormLabel>
                        <Input {...field} id="gitlabName" />
                        <FormErrorMessage>
                          {form.errors.gitlabName}
                        </FormErrorMessage>
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
