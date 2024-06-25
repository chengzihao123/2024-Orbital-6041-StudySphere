import { Avatar, Stack, Tooltip } from "@chakra-ui/react";
import Link from "next/link";

export default function HomeAvatar() {
  return (
    <Tooltip label="Profile" fontSize="xs">
      <Link href="/profile">
        <Stack direction="row">
          <Avatar
            name="Zhmaster"
            src="https://bit.ly/broken-link"
            size={"md"}
            bg={"red"}
            className="hover:scale-110 cursor-pointer"
          />
        </Stack>
      </Link>
    </Tooltip>
  );
}
