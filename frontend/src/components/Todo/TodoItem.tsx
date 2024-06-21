import React, { useState } from 'react';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { firestore } from '../../../firebase/firebase';
import { removeTodo, updateTodo } from '../../store/todoSlice';

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

const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(todo.status);
  const [completed, setCompleted] = useState(todo.completed);

  const handleDelete = async () => {
    try {
      const todoRef = doc(firestore, 'todos', todo.id);
      await deleteDoc(todoRef);
      dispatch(removeTodo(todo.id));
      alert("Todo deleted successfully!");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    const isCompleted = newStatus === 'Completed';
    setCompleted(isCompleted);

    try {
      const todoRef = doc(firestore, 'todos', todo.id);
      await updateDoc(todoRef, { status: newStatus, completed: isCompleted });
      dispatch(updateTodo({ id: todo.id, data: { status: newStatus, completed: isCompleted } }));
      alert("Todo status updated successfully!");
    } catch (error) {
      console.error("Error updating todo status:", error);
    }
  };

  const getBackgroundColor = () => {
    if (completed) return 'bg-gray-400';
    if (todo.priority === 'High') return 'bg-pink-200';
    if (todo.priority === 'Medium') return 'bg-yellow-200';
    return 'bg-green-200';
  };

  return (
    <div className={`grid grid-cols-6 gap-4 items-center p-4 ${getBackgroundColor()} shadow-md rounded-lg mb-4`}>
      <div className="col-span-2 overflow-hidden">
        <h3 className="text-lg font-semibold text-gray-900">{todo.taskName}</h3>
        <p className="text-sm text-gray-600 truncate">{todo.taskDescription}</p>
      </div>
      <div className="col-span-1">
        <p className="text-sm text-gray-700">{new Date(todo.deadline).toLocaleDateString()}</p>
      </div>
      <div className="col-span-1">
        <p className={`text-sm ${todo.priority === 'High' ? 'text-red-600' : todo.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
          {todo.priority}
        </p>
      </div>
      <div className="col-span-1">
        <select
          value={status}
          onChange={handleStatusChange}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Overdue">Overdue</option>
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
