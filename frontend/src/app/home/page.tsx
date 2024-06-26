"use client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/Auth/AuthContext";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { setTodos } from "@/store/todoSlice";
import HomeAvatar from "@/components/Home/HomeAvatar";
import HomeStudySection from "@/components/Home/Section/HomeStudySection";
import HomeRewardSection from "@/components/Home/Section/HomeRewardSection";
import HomeTodoSection from "@/components/Home/Section/HomeTodoSection";
import HomeCommunitySection from "@/components/Home/Section/HomeCommunitySection";
import LoadingState from "@/components/General/LoadingState";

interface Todo {
  id: string;
  deadline: string;
  priority: string;
  status: string;
  completed: boolean;
  taskName: string;
  taskDescription: string;
}

export default function HomePage() {
  const dispatch: AppDispatch = useDispatch();
  const { currentUser, profile } = useAuth() || {};
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const todosCollection = collection(firestore, "todos");
    const q = query(todosCollection, where("userId", "==", currentUser.uid));
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

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[500px]">
          <LoadingState />
        </div>
      ) : (
        <div className="grid grid-rows-12 px-5 h-[610px]">
          <div className="flex flex-row items-center w-full row-span-1 my-5">
            <HomeAvatar
              classes="hover:scale-110 cursor-pointer"
              isHome={true}
            />
            <div className="p-3">
              Welcome, {profile?.displayName || "user"}!
            </div>
          </div>
          <div className="row-span-8 mt-5 mb-5 grid grid-cols-4">
            <HomeTodoSection />
            <HomeStudySection />
          </div>
          <div className="row-span-5 grid grid-cols-4 mb-2">
            <HomeRewardSection />
            <HomeCommunitySection />
          </div>
        </div>
      )}
    </>
  );
}
