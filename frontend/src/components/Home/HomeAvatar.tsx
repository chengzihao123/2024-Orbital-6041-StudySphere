// HomeAvatar.js
import React from "react";
import { Avatar, Stack, Tooltip } from "@chakra-ui/react";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";

export default function HomeAvatar() {
  const { profile } = useAuth() || {};

  return (
    <Tooltip label="Profile" fontSize="xs">
      <Link href="/profile">
        <Stack direction="row">
          <Avatar
            name={profile?.displayName ?? ""}
            src={profile?.photoURL ?? ""}
            size={"md"}
            bg={"red"}
            className="hover:scale-110 cursor-pointer"
          />
        </Stack>
      </Link>
    </Tooltip>
  );
}
