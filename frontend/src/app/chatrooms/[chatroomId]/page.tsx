"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  arrayRemove,
  getDocs
} from 'firebase/firestore';
import { firestore } from '../../../../firebase/firebase';
import { useAuth } from '@/components/Auth/AuthContext';
import ChatMessages from '@/components/Chatroom/ChatMessages';
import MessageInput from '@/components/Chatroom/MessageInput';
import DeleteChatroomButton from '@/components/Chatroom/DeleteChatroomButton';

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

    getDoc(chatroomRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          setChatroom(docSnapshot.data());
        } else {
          router.push('/chatroom');
        }
      })
      .catch((error) => {
        console.error('Error fetching chatroom data:', error);
        router.push('/chatroom');
      });

    const messagesRef = collection(firestore, `chatrooms/${chatroomId}/messages`);
    const q = query(messagesRef, orderBy('createdAt'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
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
      },
      (error) => {
        console.error('Error fetching messages:', error);
      }
    );

    return () => unsubscribe();
  }, [chatroomId, currentUser, router]);

  const handleSendMessage = async (message: string) => {
    if (currentUser) {
      await addDoc(collection(firestore, `chatrooms/${chatroomId}/messages`), {
        text: message,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
      });
    }
  };

  const handleDeleteRoom = async () => {
    if (chatroom && currentUser && chatroom.createdBy === currentUser.uid) {
      try {
        const chatroomRef = doc(firestore, 'chatrooms', chatroomId);

        // get all msgs in the chatroom and delete them
        const messagesRef = collection(firestore, `chatrooms/${chatroomId}/messages`);
        const messageSnapshot = await getDocs(messagesRef);
        const deleteMessagePromises = messageSnapshot.docs.map((messageDoc) =>
          deleteDoc(messageDoc.ref)
        );

        // wait for all message deletions to complete
        await Promise.all(deleteMessagePromises);

        // remove chatroom references from users
        const members = chatroom.members || [];
        for (const memberId of members) {
          const userRef = doc(firestore, 'users', memberId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            await updateDoc(userRef, {
              chatrooms: arrayRemove(chatroomId)
            });
          } else {
            console.warn(`User document for ${memberId} does not exist.`);
          }
        }

        // delete the chatroom itself
        await deleteDoc(chatroomRef);

        // redirect to chatroom list
        router.push('/chatrooms');
      } catch (error) {
        console.error('Error deleting the chatroom:', error);
        alert('Error deleting the chatroom. Please check your permissions and try again.');
      }
    } else {
      console.warn('You are not the owner of this chatroom or no chatroom found.');
    }
  };

  if (!chatroom) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{chatroom.name}</h1>
      <ChatMessages messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
      {chatroom.createdBy === currentUser?.uid && (
        <DeleteChatroomButton onDelete={handleDeleteRoom} isOwner={true} />
      )}
    </div>
  );
};

export default ChatroomPage;
