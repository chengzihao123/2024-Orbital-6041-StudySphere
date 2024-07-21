import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TodoItem from "../Todo/TodoItem";

export default function VSStodoSection() {
  const { todos } = useSelector((state: RootState) => state.todo);

  return (
    <div className="w-full p-5 border-2 rounded-xl">
      <div className="flex justify-center text-xl mb-2 pb-2 border-b-2 border-teal-500">
        Weekly Todo-list Summary
      </div>
      <div className="flex justify-center mt-5 mb-4">
        You have completed 10 todo items this week
      </div>
      <div>Upcoming unfinished events</div>
      <div className="max-h-96 overflow-y-auto">
        {todos
          .filter((todo) => todo.status !== "Completed")
          .map((todo) => (
            <TodoItem key={todo.id} todo={todo} isHome={true} />
          ))}
      </div>
    </div>
  );
}
