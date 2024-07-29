import ProtectedRoute from &apos@/components/ProtectedRoute&apos;
import TodoList from &apos@/components/Todo/TodoList&apos;

export default function TodosPage() {
  return (
    <ProtectedRoute>
      <TodoList />
    </ProtectedRoute>
  );
}
