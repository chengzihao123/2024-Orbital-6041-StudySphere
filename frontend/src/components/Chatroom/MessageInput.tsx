"use client";
import React, { useRef } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const messageRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageRef.current && messageRef.current.value.trim()) {
      onSendMessage(messageRef.current.value);
      messageRef.current.value = '';
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex mb-4">
      <input
        type="text"
        ref={messageRef}
        placeholder="Type a message"
        className="message-input flex-grow p-2 border rounded-md"
      />
      <button type="submit" className="send-button ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
        Send
      </button>
    </form>
  );
};

export default MessageInput;
