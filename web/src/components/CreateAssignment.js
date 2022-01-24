import {
  Button,
  Flex,
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
import assignmentApi from "../api/assignment";
import Markdown from "markdown-to-jsx";
import options from "../consts/markdown";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";

export default function CreateAssignment({
  assignmentsStateDispatch,
  courseId,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function validateName(value) {
    if (!value) {
      return "Name is required";
    }
  }

  function validateGitlabName(value) {
    if (!value) {
      return "Gitlab Name is required";
    }
  }

  async function createAssignment(createAssignmentValues) {
    createAssignmentValues.courseId = courseId;
    try {
      const createdAssignment = await assignmentApi.createAssignment(
        createAssignmentValues
      );
      assignmentsStateDispatch({
        type: "createAssignment",
        assignment: createdAssignment,
      });

      toast({
        title: "Create assignment successful.",
        description: `Created assignment '${createAssignmentValues.name}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Create assignment failed.",
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

      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Formik
            initialValues={{
              name: "",
              description: "",
              gitlabName: "",
            }}
            onSubmit={async (values, actions) => {
              await createAssignment(values);
              actions.setSubmitting(false);
              onClose();
            }}
          >
            {(props) => (
              <Form>
                <ModalHeader>Create Assignment</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex w="100%" gridGap="1rem" justifyContent="space-between">
                    <Flex w="50%">
                      <Field name="name" validate={validateName}>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={form.errors.name && form.touched.name}
                          >
                            <FormLabel htmlFor="name">Name</FormLabel>
                            <Input {...field} id="name" />
                            <FormErrorMessage>
                              {form.errors.name}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Flex>
                    <Flex w="50%" mb="1rem">
                      <Field name="gitlabName" validate={validateGitlabName}>
                        {({ field, form }) => (
                          <FormControl
                            isInvalid={
                              form.errors.gitlabName && form.touched.gitlabName
                            }
                          >
                            <FormLabel htmlFor="gitlabName">
                              Gitlab Name
                            </FormLabel>
                            <Input {...field} id="gitlabName" />
                            <FormErrorMessage>
                              {form.errors.gitlabName}
                            </FormErrorMessage>
                          </FormControl>
                        )}
                      </Field>
                    </Flex>
                  </Flex>
                  <Field name="description">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.description && form.touched.description
                        }
                      >
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <FormErrorMessage>
                          {form.errors.description}
                        </FormErrorMessage>
                        <Flex
                          w="100%"
                          gridGap="1rem"
                          h="100%"
                          justifyContent="space-between"
                        >
                          <AceEditor
                            style={{ border: "1px solid lightgray" }}
                            mode="markdown"
                            id="description"
                            height="30rem"
                            width="50%"
                            value={field.value}
                            onChange={(value) => {
                              field.onChange("description")(value);
                            }}
                          />
                          <Flex
                            w="50%"
                            h="30rem"
                            p="0.5rem"
                            border="1px solid lightgray"
                            overflow="auto"
                          >
                            <Markdown
                              children={field.value}
                              options={options}
                            />
                          </Flex>
                        </Flex>
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
