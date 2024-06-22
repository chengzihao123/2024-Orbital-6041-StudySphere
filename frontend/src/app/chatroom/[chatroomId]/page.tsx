"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, collection, onSnapshot, orderBy, query, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '../../../../firebase/firebase';
import { useAuth } from '@/components/Auth/AuthContext';

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
}

const ChatroomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams(); 
  const chatroomId = params.chatroomId as string; 
  const { currentUser } = useAuth() || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatroom, setChatroom] = useState<any>(null);
  const messageRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) {
      router.push('/'); 
      return;
    }

    if (!chatroomId) {
      console.warn('Chatroom ID is not available');
      return;
    }

    const chatroomRef = doc(firestore, 'chatrooms', chatroomId);

    getDoc(chatroomRef).then((docSnapshot) => {
      if (docSnapshot.exists()) {
        setChatroom(docSnapshot.data());
      } else {
        router.push('/chatroom'); 
      }
    }).catch((error) => {
      console.error('Error fetching chatroom data:', error);
      router.push('/chatroom'); 
    });

    const messagesRef = collection(firestore, `chatrooms/${chatroomId}/messages`);
    const q = query(messagesRef, orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          text: data.text,
          userId: data.userId,
          createdAt: data.createdAt,
        };
      });
      setMessages(msgs);
    }, (error) => {
      console.error('Error fetching messages:', error);
    });

    return () => unsubscribe();
  }, [chatroomId, currentUser, router]);

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

  if (!chatroom) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{chatroom.name}</h1>
      <div className="messages-container overflow-auto mb-4 max-h-96">
        {messages.map((msg) => (
          <div key={msg.id} className="message-item p-2 border-b">
            <p>{msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          ref={messageRef}
          placeholder="Type a message"
          className="message-input flex-grow p-2 border rounded-md"
        />
        <button type="submit" className="send-button ml-2 p-2 bg-blue-500 text-white rounded-md">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatroomPage;
