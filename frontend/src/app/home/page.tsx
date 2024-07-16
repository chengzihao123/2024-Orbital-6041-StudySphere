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
import Notifications from "@/components/Home/Section/Notifications";
import { Todo } from "@/components/Todo/types";

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
        <div className="container mx-auto px-4 pb-2">
          <div className="flex items-center mb-4">
            <HomeAvatar
              classes="hover:scale-110 cursor-pointer"
              isHome={true}
            />
            <div className="ml-4 text-lg font-bold">
              Welcome, {profile?.displayName || "user"}!
            </div>
          </div>
          <Notifications />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="grid grid-rows-3 col-span-2 space-y-4">
              <HomeTodoSection style="row-span-2 col-span-3 mr-5 rounded-xl bg-slate-300 p-3" />
              <HomeRewardSection style="row-span-1 col-span-3  bg-darkerBlue mr-5 p-3 rounded-xl" />
            </div>
            <div className="grid grid-rows-3 col-span-1 space-y-4">
              <HomeStudySection style="row-span-2 col-span-1 bg-lightBlue p-3 rounded-xl" />
              <HomeCommunitySection style="col-span-1  bg-skyBlue p-3 rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
