import React, { useEffect, useRef } from 'react';
import Message from './Message';

interface ChatMessagesProps {
  messages: any[];
  currentUser: any;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentUser }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="messages-container overflow-auto mb-4 max-h-96">
      {messages.map((msg) => (
        <Message key={msg.id} message={msg} currentUser={currentUser?.uid || ''} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
