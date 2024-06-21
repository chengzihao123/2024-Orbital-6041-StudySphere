import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Todo {
  id: string;
  deadline: string;
  priority: string;
  status: string;
  completed: boolean;
  taskName: string;
  taskDescription: string;
}

interface TodoItems {
  id: string;
  taskName: string;
  taskDescription: string;
  deadline: string;
  status: string;
  priority: string;
  completed: boolean;
}
interface Filter {
  date: string;
  priority: string;
  status: string;
}

export interface TodoState {
  todos: Todo[];
  filter: Filter;
  todosItems: TodoItems[];
}

const initialTodoState: TodoState = {
  todos: [],
  filter: {
    date: "mostRecent",
    priority: "all",
    status: "all",
  },
  todosItems: [],
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
      const index = state.todosItems.findIndex((item) => item.id === id);
      state.todosItems[index].completed = completed;
    },
    setStatus(state, action: PayloadAction<{ id: string; status: string }>) {
      const { id, status } = action.payload;
      const index = state.todosItems.findIndex((item) => item.id === id);
      state.todosItems[index].status = status;
    },
  },
});

export const { setTodos, setFilter, setCompleted, setStatus } =
  todoSlice.actions;

export default todoSlice.reducer;
