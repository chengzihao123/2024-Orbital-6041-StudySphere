"use client";
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '../Auth/AuthContext';

const JoinChatroom: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const [chatroomId, setChatroomId] = useState('');
  const [chatroomCount, setChatroomCount] = useState(0);
  const [isLimitReached, setIsLimitReached] = useState(false);

  // fetch the users chatroom count when the component mounts/ currentuser changes
  useEffect(() => {
    if (currentUser) {
      const fetchChatroomCount = async () => {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        // get the chatrooms array from the user document, if not present set to empty arr
        const userChatrooms = userDoc.data()?.chatrooms || [];
        setChatroomCount(userChatrooms.length);
        if (userChatrooms.length >= 5) {
          setIsLimitReached(true);
        }
      };
      fetchChatroomCount();
    }
  }, [currentUser]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser && chatroomId && chatroomCount < 5) {
      const chatroomRef = doc(firestore, 'chatrooms', chatroomId);
      await updateDoc(chatroomRef, {
        members: arrayUnion(currentUser.uid),
      });

      const userDocRef = doc(firestore, 'users', currentUser.uid);
      await setDoc(userDocRef, {
        chatrooms: arrayUnion(chatroomId),
      }, { merge: true });

      setChatroomId('');
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleJoin} className="mb-4">
        <input
          type="text"
          placeholder="Chatroom ID"
          value={chatroomId}
          onChange={(e) => setChatroomId(e.target.value)}
          className="p-2 border rounded-md w-full"
          required
          disabled={isLimitReached}
        />
        <button
          type="submit"
          className="mt-2 p-2 bg-blue-500 text-white rounded-md w-full"
          disabled={isLimitReached}
        >
          Join Chatroom
        </button>
      </form>
      {isLimitReached && (
        <p className="text-red-600">Max limit of 5 chatrooms reached. You cannot join more.</p>
      )}
    </div>
  );
};

export default JoinChatroom;
