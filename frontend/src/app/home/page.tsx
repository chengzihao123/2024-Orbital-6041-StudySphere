import { Avatar, AvatarBadge, AvatarGroup, Stack } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <div className="grid grid-rows-10 px-5 " style={{ height: "610px" }}>
      <div className="flex flex-row items-center w-full row-span-1 my-5">
        <Stack direction="row">
          <Avatar
            name="user 1"
            src="https://bit.ly/broken-link"
            size={"lg"}
            bg={"red"}
          />
        </Stack>
        <div className="p-3">Progress</div>
      </div>
      <div className="row-span-6 mt-5 mb-5 grid grid-cols-4">
        <div className="col-span-3 mr-5 rounded-xl bg-slate-300 p-3">hello</div>
        <div className="col-span-1 bg-slate-400 p-3 rounded-xl">nihao</div>
      </div>
      <div className="row-span-3 grid grid-cols-4 mb-2">
        <div className="col-span-3  bg-red-300 mr-5 p-3 rounded-xl">hello</div>
        <div className="col-span-1  bg-red-400 p-3 rounded-xl">nihao</div>
      </div>
    </div>
  );
}
