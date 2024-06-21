// AdditionalSettingsModal.tsx
import React, { useState, useEffect } from "react";

type AdditionalSettingsModalProps = {
  onClose: () => void;
  backgroundImages: string[];
  onSettingsSubmit: (settings: {
    backgroundImage: string;
    backgroundMusic: string;
  }) => void;
};

export default function AdditionalSettingsModal({
  onClose,
  backgroundImages,
  onSettingsSubmit,
}: AdditionalSettingsModalProps) {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [backgroundMusic, setBackgroundMusic] = useState("");

  // to be replaced by the backend
  useEffect(() => {
    // Check if there is a previously selected background image in localStorage
    const savedBackgroundImage = localStorage.getItem("backgroundImage");
    if (
      savedBackgroundImage &&
      backgroundImages.includes(savedBackgroundImage)
    ) {
      setBackgroundImage(savedBackgroundImage);
    }
  }, []);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSettingsSubmit({ backgroundImage, backgroundMusic });
    onClose();
  };

  const extractFileName = (url: string) => {
    if (url.length === 0) return "None";
    const urlParts = url.split("/");
    return urlParts[urlParts.length - 1].split(".")[0];
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <form onSubmit={handleFormSubmit} className="flex flex-col space-y-4">
          <label className="text-lg font-medium">Additional Settings:</label>
          <div className="flex flex-col space-y-2">
            <div className="flex flex-col items-start">
              <label htmlFor="backgroundImage" className="text-sm">
                Background Image
              </label>
              <select
                id="backgroundImage"
                name="backgroundImage"
                className="p-2 border rounded w-full"
                value={backgroundImage}
                onChange={(e) => {
                  setBackgroundImage(e.target.value);
                  localStorage.setItem("backgroundImage", e.target.value); // Save selected image to localStorage
                }}
              >
                {backgroundImages.map((image, index) => (
                  <option key={index} value={image}>
                    {extractFileName(image)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start">
              <label htmlFor="backgroundMusic" className="text-sm">
                Background Music URL
              </label>
              <input
                type="text"
                id="backgroundMusic"
                name="backgroundMusic"
                className="p-2 border rounded w-full"
                value={backgroundMusic}
                onChange={(e) => setBackgroundMusic(e.target.value)}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="p-2 bg-green-500 text-white rounded hover:scale-105"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-red-500 text-white rounded hover:scale-105"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
