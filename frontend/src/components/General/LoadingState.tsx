import { Spinner } from "@chakra-ui/react";
export default function LoadingState() {
  return (
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
      boxSize={"100px"}
    />
  );
}
