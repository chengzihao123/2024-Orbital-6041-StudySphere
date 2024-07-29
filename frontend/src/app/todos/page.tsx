import ProtectedRoute from "@/components/ProtectedRoute";
import TodoList from "@/components/Todo/TodoList";

export default function TodosPage() {
  return (
    <ProtectedRoute>
      <TodoList />
    </ProtectedRoute>
  );
}
