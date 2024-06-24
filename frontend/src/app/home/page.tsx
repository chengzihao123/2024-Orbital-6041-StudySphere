"use client";
import { Avatar, Stack } from "@chakra-ui/react";
import { filterTodos } from "@/components/Todo/TodoList";
import TodoItem from "@/components/Todo/TodoItem";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function HomePage() {
  const { todos, filter } = useSelector((state: RootState) => state.todo);
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
        <div className="col-span-3 mr-5 rounded-xl bg-slate-300 p-3">
          <ul className="space-y-4">
            {filterTodos(todos, filter)
              .slice(0, 3)
              .map((todo) => (
                <TodoItem key={todo.id} todo={todo} isHome={true} />
              ))}
          </ul>
          <div className="flex justify-end mt-2">Process to check</div>
        </div>

        <div className="col-span-1 bg-slate-400 p-3 rounded-xl">nihao</div>
      </div>
      <div className="row-span-3 grid grid-cols-4 mb-2">
        <div className="col-span-3  bg-red-300 mr-5 p-3 rounded-xl">hello</div>
        <div className="col-span-1  bg-red-400 p-3 rounded-xl">nihao</div>
      </div>
    </div>
  );
}
