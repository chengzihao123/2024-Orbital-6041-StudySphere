"use client";
import React from 'react';

interface Message {
  id: string;
  text: string;
  userId: string;
  createdAt: any;
}

interface ChatMessagesProps {
  messages: Message[];
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages }) => {
  return (
    <div className="messages-container overflow-auto mb-4 max-h-96 border border-gray-300 rounded-md p-2">
      {messages.map((msg) => (
        <div key={msg.id} className="message-item p-2 border-b">
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};

export default ChatMessages;
