import React, { createContext, useContext, useState, useEffect } from &aposreact&apos;
import { doc, getDoc } from &aposfirebase/firestore&apos;
import { firestore } from &apos../../../firebase/firebase&apos;
import { useAuth } from &apos@/components/Auth/AuthContext&apos;

interface ChatroomContextProps {
  isLimitReached: boolean;
  updateChatroomCount: () => void;
}

const ChatroomContext = createContext<ChatroomContextProps | undefined>(undefined);

export const useChatroom = () => {
  const context = useContext(ChatroomContext);
  if (!context) {
    throw new Error(&aposuseChatroom must be used within a ChatroomProvider&apos);
  }
  return context;
};

export const ChatroomProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth() || {};
  const [isLimitReached, setIsLimitReached] = useState(false);

  const updateChatroomCount = async () => {
    if (currentUser) {
      const userDocRef = doc(firestore, &aposusersChatrooms&apos, currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userChatrooms = userDoc.data()?.chatrooms || [];
      setIsLimitReached(userChatrooms.length >= 5);
    }
  };

  useEffect(() => {
    if (currentUser) {
      updateChatroomCount();
    }
  }, [currentUser]);

  return (
    <ChatroomContext.Provider value={{ isLimitReached, updateChatroomCount }}>
      {children}
    </ChatroomContext.Provider>
  );
};
