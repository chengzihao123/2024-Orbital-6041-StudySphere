import {
  doc,
  getDocs,
  deleteDoc,
  updateDoc,
  arrayRemove,
  collection,
  getDoc,
} from "firebase/firestore";
import { firestore } from "../../../firebase/firebase";
import { useRouter } from "next/navigation";

export const handleDeleteRoom = async (chatroomId: string, currentUser: any, chatroom: any) => {
  if (!chatroomId || !currentUser) return;

  const router = useRouter();

  try {
    const chatroomRef = doc(firestore, "chatrooms", chatroomId);

    // Get all messages in the chatroom and delete them
    const messagesRef = collection(firestore, `chatrooms/${chatroomId}/messages`);
    const messageSnapshot = await getDocs(messagesRef);
    const deleteMessagePromises = messageSnapshot.docs.map((messageDoc) =>
      deleteDoc(messageDoc.ref)
    );

    // Wait for all message deletions to complete
    await Promise.all(deleteMessagePromises);

    // Remove chatroom references from usersChatrooms
    const members = chatroom.members || [];
    for (const memberId of members) {
      const userRef = doc(firestore, "usersChatrooms", memberId);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, { chatrooms: arrayRemove(chatroomId) });
      } else {
        console.warn(`User document for ${memberId} does not exist.`);
      }
    }

    // Delete the chatroom itself
    await deleteDoc(chatroomRef);

    // Redirect to chatroom list
    router.push("/chatrooms");
  } catch (error) {
    console.error("Error deleting the chatroom:", error);
    alert("Error deleting the chatroom. Please check your permissions and try again.");
  }
};

export const handleLeaveRoom = async (chatroomId: string, currentUser: any) => {
  if (!chatroomId || !currentUser) return;

  const router = useRouter();

  try {
    const userRef = doc(firestore, "usersChatrooms", currentUser.uid);
    const chatroomRef = doc(firestore, "chatrooms", chatroomId);

    await updateDoc(userRef, { chatrooms: arrayRemove(chatroomId) });
    await updateDoc(chatroomRef, { members: arrayRemove(currentUser.uid) });

    router.push("/chatrooms");
  } catch (error) {
    console.error("Error leaving the chatroom:", error);
    alert("Error leaving the chatroom. Please check your permissions and try again.");
  }
};
