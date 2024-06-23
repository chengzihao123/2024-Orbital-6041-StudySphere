// src/components/Chatroom/ChatroomContext.tsx
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../Auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';

interface ChatroomContextType {
  chatroomCount: number;
  updateChatroomCount: (count: number) => void;
}

const ChatroomContext = createContext<ChatroomContextType | undefined>(undefined);

export const ChatroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth() || {};
  const [chatroomCount, setChatroomCount] = useState<number>(0);

  useEffect(() => {
    const fetchChatroomCount = async () => {
      if (currentUser) {
        const userDocRef = doc(firestore, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        const userChatrooms = userDoc.data()?.chatrooms || [];
        setChatroomCount(userChatrooms.length);
      }
    };

    fetchChatroomCount();
  }, [currentUser]);

  const updateChatroomCount = (count: number) => {
    setChatroomCount(count);
  };

  return (
    <ChatroomContext.Provider value={{ chatroomCount, updateChatroomCount }}>
      {children}
    </ChatroomContext.Provider>
  );
};

export const useChatroomCount = (): ChatroomContextType => {
  const context = useContext(ChatroomContext);
  if (context === undefined) {
    throw new Error('useChatroomCount must be used within a ChatroomProvider');
  }
  return context;
};
