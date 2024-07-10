"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  doc,
  getDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import { useAuth } from "@/components/Auth/AuthContext";
import ChatMessages from "@/components/Chatroom/ChatMessages";
import MessageInput from "@/components/Chatroom/MessageInput";
import ChatroomHeader from "@/components/Chatroom/ChatroomHeader";
import Modal from "@/components/Chatroom/Modal";
import ChatroomMembers from "@/components/Chatroom/ChatroomMembers";
import { Box } from "@chakra-ui/react";
import TabsNavigation from "@/components/Chatroom/TabsNavigation";
import ChatroomActions from "@/components/Chatroom/ChatroomActions";
import {
  handleDeleteRoom,
  handleLeaveRoom,
} from "@/components/Chatroom/chatroomUtils";

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
  displayName: string;
}

const ChatroomPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const chatroomId = params.chatroomId as string;
  const { currentUser } = useAuth() || {};
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatroom, setChatroom] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab index

  useEffect(() => {
    if (!currentUser) {
      router.push("/");
      return;
    }

    if (!chatroomId) {
      console.warn("Chatroom ID is not available");
      return;
    }

    const chatroomRef = doc(firestore, "chatrooms", chatroomId);

    const unsubscribeChatroom = onSnapshot(chatroomRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setChatroom(docSnapshot.data());
      } else {
        router.push("/chatrooms");
      }
    });

    const messagesRef = collection(
      firestore,
      `chatrooms/${chatroomId}/messages`
    );
    const q = query(messagesRef, orderBy("createdAt"));

    const unsubscribeMessages = onSnapshot(
      q,
      (snapshot) => {
        const msgs: Message[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text,
            userId: data.userId,
            createdAt: data.createdAt,
            displayName: data.displayName,
          };
        });
        setMessages(msgs);
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );

    return () => {
      unsubscribeChatroom();
      unsubscribeMessages();
    };
  }, [chatroomId, currentUser, router]);

  const handleSendMessage = async (message: string) => {
    if (currentUser) {
      await addDoc(collection(firestore, `chatrooms/${chatroomId}/messages`), {
        text: message,
        userId: currentUser.uid,
        displayName: currentUser.displayName,
        createdAt: serverTimestamp(),
      });
    }
  };

  if (!chatroom) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <ChatroomHeader chatroom={chatroom} chatroomId={chatroomId} />
      <Box width="100%" display="flex" justifyContent="center" mt={4}>
        <TabsNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </Box>
      <div className="mt-4">
        {activeTab === 0 ? (
          <>
            <ChatMessages messages={messages} currentUser={currentUser} />
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <ChatroomMembers chatroomId={chatroomId} />
        )}
      </div>
      <ChatroomActions
        chatroom={chatroom}
        currentUser={currentUser}
        handleDeleteRoom={() => setShowDeleteModal(true)}
        handleLeaveRoom={() => setShowLeaveModal(true)}
      />
      <Modal
        isOpen={showDeleteModal}
        title="Delete Chatroom"
        message="Are you sure you want to delete this chatroom? This action cannot be undone."
        onConfirm={() => handleDeleteRoom(chatroomId, currentUser, chatroom)}
        onCancel={() => setShowDeleteModal(false)}
      />
      <Modal
        isOpen={showLeaveModal}
        title="Leave Chatroom"
        message="Are you sure you want to leave this chatroom?"
        onConfirm={() => handleLeaveRoom(chatroomId, currentUser)}
        onCancel={() => setShowLeaveModal(false)}
      />
    </div>
  );
};

export default ChatroomPage;
