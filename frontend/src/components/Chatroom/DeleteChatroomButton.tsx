"use client";
import React from 'react';

interface DeleteChatroomButtonProps {
  onDelete: () => void;
  isOwner: boolean;
}

const DeleteChatroomButton: React.FC<DeleteChatroomButtonProps> = ({ onDelete, isOwner }) => {
  if (!isOwner) return null;

  return (
    <button
      onClick={onDelete}
      className="delete-button p-2 bg-red-500 text-white rounded-md"
    >
      Delete Room
    </button>
  );
};

export default DeleteChatroomButton;
