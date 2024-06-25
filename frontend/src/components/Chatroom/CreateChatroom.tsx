"use client";
import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useAuth } from "@/components/Auth/AuthContext";

const CreateChatroom: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const [chatroomName, setChatroomName] = useState("");
  const [chatroomCount, setChatroomCount] = useState(0);
  const [isMaxLengthReached, setIsMaxLengthReached] = useState(false);
  const maxChatroomNameLength = 15;

  useEffect(() => {
    if (currentUser) {
      const checkUserChatrooms = async () => {
        try {
          const userDocRef = doc(firestore, "usersChatrooms", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userChatrooms = userDoc.data()?.chatrooms || [];
            setChatroomCount(userChatrooms.length);
          } else {
            // Create a new user document with an empty chatrooms array
            await setDoc(userDocRef, { chatrooms: [] });
            setChatroomCount(0);
          }
        } catch (error) {
          console.error("Error checking user chatrooms:", error);
        }
      };

      checkUserChatrooms();
    }
  }, [currentUser]);

  const handleCreateChatroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatroomName && currentUser) {
      if (chatroomCount < 5) {
        try {
          const chatroomDoc = await addDoc(collection(firestore, "chatrooms"), {
            name: chatroomName,
            createdAt: new Date(),
            members: [currentUser.uid],
            createdBy: currentUser.uid,
          });

          // Update user's chatroom list
          const userDocRef = doc(firestore, "usersChatrooms", currentUser.uid);
          await setDoc(
            userDocRef,
            {
              chatrooms: arrayUnion(chatroomDoc.id),
            },
            { merge: true }
          );

          setChatroomName("");
          setIsMaxLengthReached(false);
        } catch (error) {
          console.error("Error creating chatroom:", error);
        }
      } else {
        alert("You can only join or create up to 5 chatrooms.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= maxChatroomNameLength) {
      setChatroomName(value);
      setIsMaxLengthReached(value.length === maxChatroomNameLength);
    }
  };

  return (
    <form onSubmit={handleCreateChatroom} className="mb-4">
      <input
        type="text"
        placeholder="Chatroom Name"
        value={chatroomName}
        onChange={handleInputChange}
        className="p-2 border rounded-md w-full"
        maxLength={maxChatroomNameLength}
        required
      />
      {isMaxLengthReached && (
        <p className="text-red-500 text-sm mt-1">Character limit reached (15 characters).</p>
      )}
      <button
        type="submit"
        className="mt-2 p-2 bg-green-500 text-white rounded-md w-full"
      >
        Create Chatroom
      </button>
    </form>
  );
};

export default CreateChatroom;
