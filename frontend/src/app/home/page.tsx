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

interface Todo {
  id: string;
  deadline: string;
  priority: string;
  status: string;
  completed: boolean;
  taskName: string;
  taskDescription: string;
}

const sampleNotifications = [
  {
    userId: "user123",
    message: "Reminder: Your task 'Complete the project report' is due tomorrow.",
    read: false,
    timestamp: new Date(),
  },
  {
    userId: "user123",
    message: "You have been assigned a new task 'Prepare for the client meeting'.",
    read: false,
    timestamp: new Date(),
  },
  {
    userId: "user123",
    message: "Congratulations! You have completed the task 'Submit the budget report'.",
    read: true,
    timestamp: new Date(),
  },
  {
    userId: "user123",
    message: "The task 'Finish the design mockup' is overdue.",
    read: false,
    timestamp: new Date(),
  },
  {
    userId: "user123",
    message: "New updates are available for the project management tool.",
    read: false,
    timestamp: new Date(),
  },
];

export default function HomePage() {
  const dispatch: AppDispatch = useDispatch();
  const { currentUser, profile } = useAuth() || {};
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [notifications, setNotifications] = useState(sampleNotifications); // Temporary state for notifications

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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center mb-4">
            <HomeAvatar classes="hover:scale-110 cursor-pointer" isHome={true} />
            <div className="ml-4 text-lg font-bold">
              Welcome, {profile?.displayName || "user"}!
            </div>
          </div>
          <Notifications />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <HomeTodoSection />
              <HomeRewardSection />
            </div>
            <div className="col-span-1 space-y-4">
              <HomeStudySection />
              <HomeCommunitySection />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
