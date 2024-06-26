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
  deleteDoc,
  updateDoc,
  arrayRemove,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import { useAuth } from "@/components/Auth/AuthContext";
import ChatMessages from "@/components/Chatroom/ChatMessages";
import MessageInput from "@/components/Chatroom/MessageInput";
import DeleteChatroomButton from "@/components/Chatroom/DeleteChatroomButton";
import ChatroomHeader from "@/components/Chatroom/ChatroomHeader";
import Modal from "@/components/Chatroom/Modal"; // Import the modal component

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

  const handleDeleteRoom = async () => {
    if (chatroom && currentUser && chatroom.createdBy === currentUser.uid) {
      try {
        const chatroomRef = doc(firestore, "chatrooms", chatroomId);

        // get all msgs in the chatroom and delete them
        const messagesRef = collection(
          firestore,
          `chatrooms/${chatroomId}/messages`
        );
        const messageSnapshot = await getDocs(messagesRef);
        const deleteMessagePromises = messageSnapshot.docs.map((messageDoc) =>
          deleteDoc(messageDoc.ref)
        );

        // wait for all message deletions to complete
        await Promise.all(deleteMessagePromises);

        // remove chatroom references from usersChatrooms
        const members = chatroom.members || [];
        for (const memberId of members) {
          const userRef = doc(firestore, "usersChatrooms", memberId);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            await updateDoc(userRef, {
              chatrooms: arrayRemove(chatroomId),
            });
          } else {
            console.warn(`User document for ${memberId} does not exist.`);
          }
        }

        // delete the chatroom itself
        await deleteDoc(chatroomRef);

        // redirect to chatroom list
        router.push("/chatrooms");
      } catch (error) {
        console.error("Error deleting the chatroom:", error);
        alert(
          "Error deleting the chatroom. Please check your permissions and try again."
        );
      }
    } else {
      console.warn(
        "You are not the owner of this chatroom or no chatroom found."
      );
    }
  };

  const handleLeaveRoom = async () => {
    if (chatroom && currentUser) {
      try {
        const userRef = doc(firestore, "usersChatrooms", currentUser.uid);
        const chatroomRef = doc(firestore, "chatrooms", chatroomId);

        await updateDoc(userRef, {
          chatrooms: arrayRemove(chatroomId),
        });

        await updateDoc(chatroomRef, {
          members: arrayRemove(currentUser.uid),
        });

        router.push("/chatrooms");
      } catch (error) {
        console.error("Error leaving the chatroom:", error);
        alert(
          "Error leaving the chatroom. Please check your permissions and try again."
        );
      }
    }
  };

  if (!chatroom) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <ChatroomHeader chatroom={chatroom} chatroomId={chatroomId} />
      <ChatMessages messages={messages} currentUser={currentUser} />
      <MessageInput onSendMessage={handleSendMessage} />
      {chatroom.createdBy === currentUser?.uid ? (
        <>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-4 p-2 bg-red-500 text-white rounded-md"
          >
            Delete Chatroom
          </button>
          <Modal
            isOpen={showDeleteModal}
            title="Delete Chatroom"
            message="Are you sure you want to delete this chatroom? This action cannot be undone."
            onConfirm={handleDeleteRoom}
            onCancel={() => setShowDeleteModal(false)}
          />
        </>
      ) : (
        <>
          <button
            onClick={() => setShowLeaveModal(true)}
            className="mt-4 p-2 bg-red-500 text-white rounded-md"
          >
            Leave Chatroom
          </button>
          <Modal
            isOpen={showLeaveModal}
            title="Leave Chatroom"
            message="Are you sure you want to leave this chatroom?"
            onConfirm={handleLeaveRoom}
            onCancel={() => setShowLeaveModal(false)}
          />
        </>
      )}
    </div>
  );
};

export default ChatroomPage;
