import React, { useState, ChangeEvent } from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { setCompleted, setStatus } from "../../store/todoSlice";

interface Todo {
  id: string;
  taskName: string;
  taskDescription: string;
  deadline: string;
  status: string;
  priority: string;
  completed: boolean;
}

interface TodoItemProps {
  todo: Todo;
}

// a fc to display a single todo item (used in todolist)
const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch: AppDispatch = useDispatch();
  const { todosItems } = useSelector((state: RootState) => state.todo);
  const index = todosItems.findIndex((item) => item.id === todo.id);
  const completed = todosItems[index].completed;
  const priority = todosItems[index].priority;

  // deletes todo from firestore
  const handleDelete = async () => {
    const todoRef = doc(firestore, "todos", todo.id);
    await deleteDoc(todoRef);
  };

  // updates todo status in firestore
  const handleStatusChange = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    dispatch(setStatus({ id: todo.id, status: newStatus }));
    const isCompleted = newStatus === "Completed";
    dispatch(setCompleted({ id: todo.id, completed: isCompleted }));
    const todoRef = doc(firestore, "todos", todo.id);
    await updateDoc(todoRef, { status: newStatus, completed: isCompleted });
  };

  const getBackgroundColor = (): string => {
    if (completed) return "bg-gray-400";
    if (priority === "High") return "bg-pink-200";
    if (priority === "Medium") return "bg-yellow-200";
    return "bg-green-200";
  };

  return (
    <div
      className={`grid grid-cols-6 gap-4 items-center p-4 ${getBackgroundColor()} shadow-md rounded-lg mb-4`}
    >
      <div className="col-span-2 overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900">{todo.taskName}</h3>
        <p className="text-sm text-gray-600 truncate">{todo.taskDescription}</p>
      </div>
      <div className="col-span-1">
        <p className="text-sm text-gray-700">{todo.deadline}</p>
      </div>
      <div className="col-span-1">
        <p
          className={`text-sm ${
            priority === "High"
              ? "text-red-600"
              : priority === "Medium"
              ? "text-yellow-600"
              : "text-green-600"
          }`}
        >
          {priority}
        </p>
      </div>
      <div className="col-span-1">
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option>Not Started</option>
          <option>In Progress</option>
          <option>Completed</option>
          <option>Overdue</option>
        </select>
      </div>
      <div className="col-span-1 flex justify-end">
        <button
          onClick={handleDelete}
          className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
