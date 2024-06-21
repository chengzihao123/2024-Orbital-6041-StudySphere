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

interface Todo {
  id: string;
  deadline: string;
  priority: string;
  status: string;
  completed: boolean;
  taskName: string;
  taskDescription: string;
}
const TodoList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { todos, filter } = useSelector((state: RootState) => state.todo);
  const { currentUser } = useAuth() || {};
  const router = useRouter();

  // fetch todos from firestore
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
        // setTodos([]);
        dispatch(setTodos([]));
      } else {
        // map todos from snapshot and update todos state
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

        // setTodos(updatedTodos);
        dispatch(setTodos(updatedTodos));
      }
    });

    return unsubscribe;
  }, [currentUser, router]);

  const filterTodos = (todos: Todo[]): Todo[] => {
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
          return (
            new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
          );
        } else {
          return (
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          );
        }
      })
      .sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
      });
  };

  return (
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
            {filterTodos(todos).map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        </div>
      </div>
      <div className="md:flex-[1] order-2 md:order-2 hidden md:block">
        <TodoFilter />
      </div>
    </div>
  );
};

export default TodoList;
