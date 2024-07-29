import React, { useEffect, useRef } from &aposreact&apos;
import Message from &apos./Message&apos;
import Question from &apos./Question&apos;

interface Message {
  id: string;
  type: "message";
  text: string;
  imageUrl?: string;
  userId: string;
  createdAt: any;
  displayName: string;
}

interface Question {
  id: string;
  type: "question";
  question: string;
  topic: string;
  userId: string;
  createdAt: any;
}

interface ChatMessagesProps {
  items: (Message | Question)[];
  currentUser: any;
  onAnswerSubmit: (answer: string, questionId: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ items, currentUser, onAnswerSubmit }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: &apossmooth&apos });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [items]);

  return (
    <div className="messages-container overflow-auto mb-4 max-h-96">
      {items.map((item) => {
        if (item.type === "message") {
          return <Message key={item.id} message={item} currentUser={currentUser?.uid || &apos&apos} />;
        }
        if (item.type === "question") {
          return <Question key={item.id} question={item} currentUser={currentUser?.uid || &apos&apos} onAnswerSubmit={onAnswerSubmit} />;
        }
        return null;
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
