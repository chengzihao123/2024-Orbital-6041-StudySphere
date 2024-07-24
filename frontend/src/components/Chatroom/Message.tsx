import React, { useState } from 'react';
import ImageModal from './ImageModal';

interface MessageProps {
  message: {
    text: string;
    imageUrl?: string;
    userId: string;
    displayName: string;
    createdAt: any;
  };
  currentUser: string;
}

const Message: React.FC<MessageProps> = ({ message, currentUser }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const isCurrentUser = message.userId === currentUser;

  const handleImageClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className={`p-2 rounded-md shadow-md max-w-[75%] break-words ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <p className="text-xs font-semibold mb-1">{message.displayName}</p>
          {message.text && <p>{message.text}</p>}
          {message.imageUrl && (
            <img
              src={message.imageUrl}
              alt="Sent Image"
              className="mt-2 rounded-md cursor-pointer"
              style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'cover' }}
              onClick={handleImageClick}
            />
          )}
        </div>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        imageUrl={message.imageUrl || ''}
      />
    </>
  );
};

export default Message;
