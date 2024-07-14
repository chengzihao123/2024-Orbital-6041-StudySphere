import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo, Filter } from "@/components/Todo/types"; // Adjust the path accordingly

export interface TodoState {
  todos: Todo[];
  filter: Filter;
}

const initialTodoState: TodoState = {
  todos: [],
  filter: {
    date: "mostRecent",
    priority: "all",
    status: "all",
  },
};

export const todoSlice = createSlice({
  name: "todo",
  initialState: initialTodoState,
  reducers: {
    setTodos(state, action: PayloadAction<Todo[]>) {
      state.todos = action.payload;
    },
    setFilter(state, action: PayloadAction<Partial<Filter>>) {
      state.filter = {
        ...state.filter,
        ...action.payload,
      };
    },
    setCompleted(
      state,
      action: PayloadAction<{ id: string; completed: boolean }>
    ) {
      const { id, completed } = action.payload;
      const index = state.todos.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.todos[index].completed = completed;
      }
    },
    setStatus(state, action: PayloadAction<{ id: string; status: string }>) {
      const { id, status } = action.payload;
      const index = state.todos.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.todos[index].status = status;
      }
    },
    updateTodo(
      state,
      action: PayloadAction<{ id: string; data: Partial<Todo> }>
    ) {
      const { id, data } = action.payload;
      const index = state.todos.findIndex((item) => item.id === id);
      if (index !== -1) {
        state.todos[index] = { ...state.todos[index], ...data };
      }
    },
    removeTodo(
      state,
      action: PayloadAction<string>
    ) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
    },
  },
});

export const { setTodos, setFilter, setCompleted, setStatus, updateTodo, removeTodo } =
  todoSlice.actions;

export default todoSlice.reducer;
