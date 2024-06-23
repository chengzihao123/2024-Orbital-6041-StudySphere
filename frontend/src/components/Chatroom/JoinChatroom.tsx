"use client";
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '../Auth/AuthContext';

const JoinChatroom: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const [chatroomId, setChatroomId] = useState('');
  const [chatroomCount, setChatroomCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const checkUserChatrooms = async () => {
        const userDoc = await getDoc(doc(firestore, 'users', currentUser.uid));
        const userChatrooms = userDoc.data()?.chatrooms || [];
        setChatroomCount(userChatrooms.length);
      };

      checkUserChatrooms();
    }
  }, [currentUser]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentUser && chatroomId) {
      if (chatroomCount < 5) {
        const chatroomRef = doc(firestore, 'chatrooms', chatroomId);
        await updateDoc(chatroomRef, {
          members: arrayUnion(currentUser.uid),
        });

        await updateDoc(doc(firestore, 'users', currentUser.uid), {
          chatrooms: arrayUnion(chatroomId),
        });

        setChatroomId('');
      } else {
        alert('You can only join or create up to 5 chatrooms.');
      }
    }
  };

  return (
    <form onSubmit={handleJoin} className="mb-4">
      <input
        type="text"
        placeholder="Chatroom ID"
        value={chatroomId}
        onChange={(e) => setChatroomId(e.target.value)}
        className="p-2 border rounded-md w-full"
        required
      />
      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded-md w-full">Join Chatroom</button>
    </form>
  );
};

export default JoinChatroom;
