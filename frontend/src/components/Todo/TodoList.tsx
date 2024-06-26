"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setTodos } from "@/store/todoSlice";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useAuth } from "../Auth/AuthContext";
import TodoItem from "./TodoItem";
import AddTodo from "./AddTodo";
import TodoFilter from "./TodoFilter";
import { useRouter } from "next/navigation";
import LoadingState from "../General/LoadingState";

interface Todo {
  id: string;
  deadline: string;
  priority: string;
  status: string;
  completed: boolean;
  taskName: string;
  taskDescription: string;
}

export const filterTodos = (todos: Todo[], filter: any): Todo[] => {
  return todos
    .filter((todo) => {
      if (
        filter.priority !== "all" &&
        todo.priority.toLowerCase() !== filter.priority
      ) {
        return false;
      }
      if (filter.status !== "all") {
        if (filter.status === "notStarted" && todo.status !== "Not Started")
          return false;
        if (filter.status === "inProgress" && todo.status !== "In Progress")
          return false;
        if (filter.status === "overdue" && todo.status !== "Overdue")
          return false;
        if (filter.status === "completed" && todo.status !== "Completed")
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (filter.date === "mostRecent") {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      } else {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    })
    .sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return 0;
    });
};

const TodoList: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const dispatch: AppDispatch = useDispatch();
  const { todos, filter } = useSelector((state: RootState) => state.todo);
  const { currentUser } = useAuth() || {};
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const todosPerPage = 10;

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const todosCollection = collection(firestore, "todos");
    const q = query(todosCollection, where("userId", "==", currentUser.uid));

    // subscribe to todos collection and update todos state
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        console.log("No todos found.");
        dispatch(setTodos([]));
      } else {
        const fetchedTodos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Todo, "id">),
        }));

        const updatedTodos = fetchedTodos.map((todo) => {
          if (
            !todo.completed &&
            new Date(todo.deadline) < new Date() &&
            todo.status !== "Overdue"
          ) {
            const todoRef = doc(firestore, "todos", todo.id);
            updateDoc(todoRef, { status: "Overdue" });
            return { ...todo, status: "Overdue" };
          }
          return todo;
        });

        dispatch(setTodos(updatedTodos));
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, router, dispatch]);

  const filteredTodos = filterTodos(todos, filter);
  const totalPages = Math.ceil(filteredTodos.length / todosPerPage);

  const currentTodos = filteredTodos.slice(
    (currentPage - 1) * todosPerPage,
    currentPage * todosPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[500px]">
          <LoadingState />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto mt-6 flex flex-col md:flex-row md:space-x-4">
          <div className="md:flex-[2] order-1 md:order-1">
            <AddTodo />
            <div className="block md:hidden mt-4">
              <TodoFilter />
            </div>
            <div className="mt-6 bg-white p-4 rounded-lg shadow-md">
              <div className="grid grid-cols-6 gap-4 items-center font-bold text-gray-700 mb-4">
                <div className="col-span-2">Task</div>
                <div className="col-span-1">Deadline</div>
                <div className="col-span-1">Priority</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-1"></div>
              </div>
              <ul className="space-y-4">
                {currentTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} isHome={false} />
                ))}
              </ul>
              <div className="mt-4 flex justify-center items-center space-x-2">
                {currentPage > 1 && (
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="px-3 py-1 bg-gray-300 rounded-lg"
                  >
                    Previous
                  </button>
                )}
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="px-3 py-1 bg-gray-300 rounded-lg"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="md:flex-[1] order-2 md:order-2 hidden md:block">
            <TodoFilter />
          </div>
        </div>
      )}
    </>
  );
};

export default TodoList;
