import { Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";

const Loading = () => {
  return (
    <Flex justifyContent="center">
      <Spinner size="xl" />
    </Flex>
  );
};

export default Loading;
