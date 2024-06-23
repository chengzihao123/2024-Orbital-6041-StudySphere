"use client";
import React, { useState, useEffect, useRef } from 'react';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../../firebase/firebase';
import { useAuth } from '@/components/Auth/AuthContext';
import Message from './Message';

interface ChatroomProps {
  chatroomId: string;
}

const Chatroom: React.FC<ChatroomProps> = ({ chatroomId }) => {
  const { currentUser } = useAuth() || {};
  const [messages, setMessages] = useState<any[]>([]);
  const messageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (chatroomId) {
      const q = query(
        collection(firestore, `chatrooms/${chatroomId}/messages`),
        orderBy('createdAt')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

      return () => unsubscribe();
    }
  }, [chatroomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageRef.current && messageRef.current.value.trim() && currentUser) {
      await addDoc(collection(firestore, `chatrooms/${chatroomId}/messages`), {
        text: messageRef.current.value,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
      messageRef.current.value = '';
    }
  };

  return (
    <div className="p-4">
      <div className="messages-container overflow-auto mb-4 max-h-96">
        {messages.map((msg) => (
          <Message key={msg.id} text={msg.text} userId={msg.userId} currentUser={currentUser?.uid || ''} />
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          ref={messageRef}
          placeholder="Type a message"
          className="message-input flex-grow p-2 border rounded-md"
        />
        <button type="submit" className="send-button ml-2 p-2 bg-blue-500 text-white rounded-md">Send</button>
      </form>
    </div>
  );
};

export default Chatroom;
