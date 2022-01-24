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
import { FiEdit } from "react-icons/fi";
import { Field, Form, Formik } from "formik";
import courseApi from "../api/course";
import Markdown from "markdown-to-jsx";
import options from "../consts/markdown";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-markdown";

export default function EditCourse({ course, coursesStateDispatch }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  function validateName(value) {
    if (!value) {
      return "Name is required";
    }
  }

  async function updateCourse(updateCourseValues) {
    try {
      const updatedCourse = await courseApi.updateCourse(
        course.id,
        updateCourseValues
      );
      coursesStateDispatch({ type: "updateCourse", course: updatedCourse });

      toast({
        title: "Update course successful.",
        description: `Updated course '${course.name}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Update course failed.",
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
      <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Course</ModalHeader>
          <ModalCloseButton />
          <Formik
            initialValues={{
              name: course.name,
              description: course.description,
            }}
            onSubmit={async (values, actions) => {
              await updateCourse(values);
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
