"use client";
import React, { useRef, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebase/firebase"; // Ensure you import the storage

interface MessageInputProps {
  onSendMessage: (message: string, imageUrl?: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const messageRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageRef.current && messageRef.current.value.trim()) {
      onSendMessage(messageRef.current.value);
      messageRef.current.value = '';
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const imageFile = e.target.files[0];
      console.log("Image file selected:", imageFile);
      setUploading(true);
      try {
        // Upload image to Firebase Storage
        const storageRef = ref(storage, `images/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const imageUrl = await getDownloadURL(storageRef);
        console.log("Image uploaded:", imageUrl);
        // Send the message with the image URL
        onSendMessage('', imageUrl);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
      setUploading(false);
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
      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="fileInput" />
      <label htmlFor="fileInput" className="ml-2 p-2 bg-gray-200 text-black rounded-md cursor-pointer">Attach Image</label>
      <button type="submit" className="send-button ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-700" disabled={uploading}>
        {uploading ? 'Uploading...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput;
