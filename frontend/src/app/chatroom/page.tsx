"use client"
import React from 'react';
import ChatroomList from '@/components/Chatroom/ChatroomList';
import CreateChatroom from '@/components/Chatroom/CreateChatroom';
import JoinChatroom from '@/components/Chatroom/JoinChatroom';
import { useAuth } from '@/components/Auth/AuthContext';
import { useRouter } from 'next/navigation';

const ChatroomPage: React.FC = () => {
  const { currentUser } = useAuth() || {};
  const router = useRouter();

  // redirect to home if not logged in
  if (!currentUser) {
    router.replace('/');
    return null;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chatrooms</h1>
      <div className="mb-4">
        <CreateChatroom />
      </div>
      <div className="mb-4">
        <JoinChatroom />
      </div>
      <ChatroomList />
    </div>
  );
};

export default ChatroomPage;
