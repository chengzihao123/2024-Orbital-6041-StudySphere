import React from 'react';

interface ChatroomHeaderProps {
  chatroom: any;
  chatroomId: string;
}

const ChatroomHeader: React.FC<ChatroomHeaderProps> = ({ chatroom, chatroomId }) => {

  const handleCopyChatroomId = () => {
    navigator.clipboard.writeText(chatroomId).then(() => {
      alert('Chatroom ID copied to clipboard');
    }).catch((err) => {
      console.error('Failed to copy chatroom ID: ', err);
    });
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-2xl font-bold">{chatroom.name}</h1>
      <div className="flex items-center">
        <span className="mr-2">ID: {chatroomId}</span>
        <button onClick={handleCopyChatroomId} className="p-2 bg-blue-500 text-white rounded-md">
          Copy ID
        </button>
      </div>
    </div>
  );
};

export default ChatroomHeader;
