"use client";
import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '@/components/Auth/AuthContext';

const CreateChatroom: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const [chatroomName, setChatroomName] = useState('');

  const handleCreateChatroom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chatroomName && currentUser) {
      await addDoc(collection(firestore, 'chatrooms'), {
        name: chatroomName,
        createdAt: new Date(),
        members: [currentUser.uid],
        createdBy: currentUser.uid,
      });
      setChatroomName('');
    }
  };

  return (
    <form onSubmit={handleCreateChatroom} className="mb-4">
      <input
        type="text"
        placeholder="Chatroom Name"
        value={chatroomName}
        onChange={(e) => setChatroomName(e.target.value)}
        className="p-2 border rounded-md w-full"
        required
      />
      <button type="submit" className="mt-2 p-2 bg-green-500 text-white rounded-md w-full">Create Chatroom</button>
    </form>
  );
};

export default CreateChatroom;
