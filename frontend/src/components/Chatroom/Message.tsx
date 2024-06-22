// components/Chatroom/Message.tsx
import React from 'react';

interface MessageProps {
  text: string;
  userId: string;
  currentUser: string;
}

const Message: React.FC<MessageProps> = ({ text, userId, currentUser }) => {
  const isOwnMessage = userId === currentUser;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`rounded-lg p-2 ${
          isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        } max-w-xs`}
      >
        <p>{text}</p>
      </div>
    </div>
  );
};

export default Message;
