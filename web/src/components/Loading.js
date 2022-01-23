import { Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

const Loading = () => {
  return (
    <Flex h="100%" alignItems="center" justifyContent="center">
      <Spinner size="xl" />
    </Flex>
  );
};

export default Loading;
