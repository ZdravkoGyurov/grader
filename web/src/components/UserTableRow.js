import {
  Avatar,
  FormControl,
  FormErrorMessage,
  Select,
  Td,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useContext } from "react";
import authApi from "../api/auth";
import UserContext from "../contexts/UserContext";
import themeStyles from "../theme";

export default function UserTableRow({ user, usersStateDispatch }) {
  const userContext = useContext(UserContext);
  const toast = useToast();

  async function validateRoleName(value) {
    if (!value) {
      return;
    }
    if (value !== "Teacher" && value !== "Student") {
      return "Role can be either Teacher or Student";
    }

    if (user.roleName === value) {
      return;
    }

    try {
      await authApi.patchUserRole(user.email, value);
      user.roleName = value;
      usersStateDispatch({ type: "updateUser", user: user });
      if (userContext.user.email === user.email) {
        userContext.setUser(Object.assign({}, user));
      }
      toast({
        title: "Changed user role.",
        description: `Changed user ${user.email} role to '${value}'`,
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
    <Tr borderBottom={`1px solid ${themeStyles.color}`} key={user.email}>
      <Td p="0.5rem" w="2rem">
        <Avatar
          border={`1px solid ${themeStyles.bgHeader}`}
          size="sm"
          src={user.avatarUrl}
        />
      </Td>
      <Td p="0.5rem">{user.name}</Td>
      <Td p="0.5rem">{user.email}</Td>
      <Td p="0.5rem">
        <Formik
          initialValues={{
            roleName: user.roleName,
          }}
          onSubmit={async (values, actions) => {
            actions.setSubmitting(false);
          }}
        >
          {(props) => (
            <Form>
              <Field name="courseRoleName" validate={validateRoleName}>
                {({ field, form }) => (
                  <FormControl
                    isInvalid={
                      form.errors.courseRoleName && form.touched.courseRoleName
                    }
                  >
                    <Select
                      w="10rem"
                      defaultValue={user.roleName}
                      id="courseRoleName"
                      {...field}
                      variant="filled"
                      disabled={user.roleName === "Admin"}
                    >
                      <option disabled value="Admin">
                        Admin
                      </option>
                      <option value="Teacher">Teacher</option>
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
    </Tr>
  );
}
