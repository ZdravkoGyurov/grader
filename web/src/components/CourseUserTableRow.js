import {
  Flex,
  FormControl,
  FormErrorMessage,
  Select,
  Td,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import userCourseApi from "../api/usercourse";
import courseUsersReducer from "../reducers/CourseUsersReducer";
import themeStyles from "../theme";
import DeleteUserCourse from "./DeleteUserCourse";

export default function CourseUserTableRow({
  courseUser,
  courseUsersDispatch,
}) {
  const toast = useToast();

  async function validateCourseRoleName(value) {
    if (!value) {
      return;
    }
    if (value !== "Assistant" && value !== "Student") {
      return "Role can be either Assistant or Student";
    }

    if (courseUser.courseRoleName === value) {
      return;
    }

    try {
      const updateCourseUser = Object.assign({}, courseUser);
      updateCourseUser.courseRoleName = value;
      const updatedCourseUser = await userCourseApi.putUserCourse(
        updateCourseUser
      );
      courseUsersDispatch({
        type: courseUsersReducer.updateCourseUsersAction,
        courseUser: updatedCourseUser,
      });

      toast({
        title: "Changed user role.",
        description: `Changed user ${courseUser.userEmail} role to '${value}'`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Change user role failed.",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }

  return (
    <Tr
      borderBottom={`1px solid ${themeStyles.color}`}
      key={courseUser.userEmail}
    >
      <Td p="0.5rem">{courseUser.userEmail}</Td>
      <Td p="0.5rem">
        <Formik
          initialValues={{
            roleName: courseUser.courseRoleName,
          }}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <Field name="courseRoleName" validate={validateCourseRoleName}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.courseRoleName && form.touched.courseRoleName
                    }
                  >
                    <Select
                      w="10rem"
                      defaultValue={courseUser.courseRoleName}
                      id="courseRoleName"
                      {...field}
                      variant="filled"
                    >
                      <option value="Assistant">Assistant</option>
                      <option value="Student">Student</option>
                    </Select>
                    <FormErrorMessage>
                      {form.errors.courseRoleName}
                    </FormErrorMessage>
                  </FormControl>
                )}
              </Field>
            </Form>
          )}
        </Formik>
      </Td>
      <Td p="0.5rem">
        <Flex justifyContent="end">
          <DeleteUserCourse
            courseUsersDispatch={courseUsersDispatch}
            userEmail={courseUser.userEmail}
            courseId={courseUser.courseId}
          />
        </Flex>
      </Td>
    </Tr>
  );
}
