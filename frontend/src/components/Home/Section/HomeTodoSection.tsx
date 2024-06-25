import { filterTodos } from "@/components/Todo/TodoList";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import TodoItem from "@/components/Todo/TodoItem";
import HomeButton from "@/components/Home/HomeButton";

export default function HomeStudySection() {
  const { todos, filter } = useSelector((state: RootState) => state.todo);
  return (
    <div className="col-span-3 mr-5 rounded-xl bg-slate-300 p-3">
      <div className="mb-3 ml-2 font-bold text-xl border-b-2 border-white pb-1">
        Todos
      </div>
      <div className="mb-2">
        <ul className="space-y-4">
          {filterTodos(todos, filter)
            .slice(0, 3)
            .map((todo) => (
              <TodoItem key={todo.id} todo={todo} isHome={true} />
            ))}
        </ul>
      </div>
      <HomeButton web={"/todos"} buttonText={"Proceed to check"} />
    </div>
  );
}
