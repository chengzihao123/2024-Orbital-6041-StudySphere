import React from 'react';

interface MessageProps {
  message: {
    text: string;
    userId: string;
    displayName: string;
    createdAt: any;
  };
  currentUser: string;
}

const Message: React.FC<MessageProps> = ({ message, currentUser }) => {
  const isCurrentUser = message.userId === currentUser;

  return (
    <div
      className={`flex ${
        isCurrentUser ? 'justify-end' : 'justify-start'
      } mb-2`}
    >
      <div
        className={`p-2 rounded-md shadow-md max-w-[75%] break-words ${
          isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        <p className="text-xs font-semibold mb-1">{message.displayName}</p>
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
