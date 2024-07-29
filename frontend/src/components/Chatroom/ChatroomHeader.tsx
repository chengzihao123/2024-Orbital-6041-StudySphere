import React from &aposreact&apos;

interface ChatroomHeaderProps {
  chatroom: any;
  chatroomId: string;
}

const ChatroomHeader: React.FC<ChatroomHeaderProps> = ({ chatroom, chatroomId }) => {

  const handleCopyChatroomId = () => {
    navigator.clipboard.writeText(chatroomId).then(() => {
      alert(&aposChatroom ID copied to clipboard&apos);
    }).catch((err) => {
      console.error(&aposFailed to copy chatroom ID: &apos, err);
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
