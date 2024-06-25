"use client";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useAuth } from "@/components/Auth/AuthContext";
import Link from "next/link";
interface Chatroom {
  id: string;
  name: string;
  members: string[];
}

const ChatroomList: React.FC<{ isHome: boolean }> = ({ isHome }) => {
  const { currentUser } = useAuth() || {};
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(firestore, "chatrooms"),
        where("members", "array-contains", currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const rooms: Chatroom[] = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Chatroom, "id">;
          return {
            id: doc.id,
            ...data,
          };
        });
        setChatrooms(rooms);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  return (
    <div>
      {!isHome ? (
        <>
          <h2 className="text-xl font-bold mb-4">Your Chatrooms</h2>
          <ul>
            {chatrooms.map((room) => (
              <li key={room.id} className="mb-2">
                <Link href={`/chatrooms/${room.id}`} className="text-blue-500">
                  {room.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h2 className="text-xs font-bold mb-2">Active Chatrooms</h2>
          <ul className="flex flex-row">
            {chatrooms.slice(0, 3).map((room) => (
              <li key={room.id} className="mb-2 mr-6">
                <Link href={`/chatrooms/${room.id}`} className="text-blue-500">
                  {room.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/chatrooms"
            className="flex justify-end font-main text-xs hover:font-bold"
          >
            Find out More
          </Link>
        </>
      )}
    </div>
  );
};

export default ChatroomList;
