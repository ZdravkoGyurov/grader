import {
  Code,
  Heading,
  ListItem,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";

const options = {
  overrides: {
    h1: {
      component: Heading,
      props: {
        size: "2xl",
      },
    },
    h2: {
      component: Heading,
      props: {
        size: "xl",
      },
    },
    h3: {
      component: Heading,
      props: {
        size: "lg",
      },
    },
    h4: {
      component: Heading,
      props: {
        size: "md",
      },
    },
    ul: {
      component: UnorderedList,
    },
    ol: {
      component: OrderedList,
    },
    li: {
      component: ListItem,
    },
    code: {
      component: Code,
    },
  },
};

export default options;
