import { Avatar, Stack } from "@chakra-ui/react";

export default function HomeAvatar() {
  return (
    <Stack direction="row">
      <Avatar
        name="Zhmaster"
        src="https://bit.ly/broken-link"
        size={"md"}
        bg={"red"}
      />
    </Stack>
  );
}
