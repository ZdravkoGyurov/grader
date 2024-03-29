import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "@chakra-ui/breadcrumb";
import { Flex, Text } from "@chakra-ui/layout";
import {
  IconButton,
  Table,
  TableCaption,
  Tbody,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useContext, useEffect, useReducer } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import authApi from "../api/auth";
import consts from "../consts/consts";
import UserContext from "../contexts/UserContext";
import usersReducer from "../reducers/UsersReducer";
import themeStyles from "../theme";
import Loading from "./Loading";
import Unauthorized from "./Unauthorized";
import UserTableRow from "./UserTableRow";

const Users = () => {
  const { user } = useContext(UserContext);
  const [state, dispatch] = useReducer(
    usersReducer.reducer,
    usersReducer.initialState
  );

  useEffect(() => {
    async function fetchUsers() {
      try {
        const users = await authApi.getUsers();
        dispatch({ type: "setUsers", users: users });
      } catch (error) {
        console.error(error);
        dispatch({ type: "setError", error: error });
      }
    }
    fetchUsers();
  }, []);

  // handle error

  return (
    <Flex flexDir="column" w="100%">
      <Flex alignItems="center" marginBottom="1rem" fontSize="2xl">
        <Breadcrumb separator="→">
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink>Users</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
      </Flex>
      {user.roleName !== "Admin" ? (
        <Unauthorized />
      ) : (
        <Flex m="0 5%" overflowY="auto" flexDir="column" p="2rem">
          {!state.fetched ? (
            <Loading />
          ) : (
            <Table variant="unstyled">
              <TableCaption m={0} placement="top">
                Users
              </TableCaption>
              <Thead borderBottom={`2px solid ${themeStyles.color}`}>
                <Tr>
                  <Th p="0.5rem"></Th>
                  <Th p="0.5rem">Name</Th>
                  <Th p="0.5rem">Email</Th>
                  <Th p="0.5rem">Role</Th>
                </Tr>
              </Thead>
              <Tbody>
                {state.users
                  .slice(
                    (state.page - 1) * consts.usersPageSize,
                    state.page * consts.usersPageSize
                  )
                  .map((user) => (
                    <UserTableRow
                      key={user.email}
                      user={user}
                      usersStateDispatch={dispatch}
                    />
                  ))}
              </Tbody>
              <Tfoot>
                <Tr>
                  <Th p="0.5rem"></Th>
                  <Th p="0.5rem"></Th>
                  <Th p="0.5rem"></Th>
                  <Th p="0.5rem">
                    <Flex alignItems="center" justifyContent="end">
                      <IconButton
                        variant="ghost"
                        disabled={state.page === 1}
                        icon={<FiArrowLeft />}
                        _focus={{ boxShadow: "none" }}
                        onClick={() => {
                          dispatch({ type: "decrementPage" });
                        }}
                      />
                      <Text m="0.5rem">Page {state.page} </Text>
                      <IconButton
                        variant="ghost"
                        disabled={state.page >= state.lastPage}
                        icon={<FiArrowRight />}
                        _focus={{ boxShadow: "none" }}
                        onClick={() => {
                          dispatch({ type: "incrementPage" });
                        }}
                      />
                    </Flex>
                  </Th>
                </Tr>
              </Tfoot>
            </Table>
          )}
        </Flex>
      )}
    </Flex>
  );
};

export default Users;
