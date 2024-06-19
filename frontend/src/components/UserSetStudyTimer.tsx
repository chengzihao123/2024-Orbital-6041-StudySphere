import { useState } from "react";
import AdditionalSettingsModal from "./Modal/AdditionalSetting";

type UserSetStudyTimerProps = {
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  closeHandler: () => void;
  backgroundImages: string[];
  onSubmit: (settings: {
    backgroundImage: string;
    backgroundMusic: string;
  }) => void;
};

export default function UserSetStudyTimer({
  submitHandler,
  closeHandler,
  backgroundImages,
  onSubmit,
}: UserSetStudyTimerProps) {
  const [showAdditionalSetting, setAdditionalSetting] = useState(false);
  const [additionalSettings, setAdditionalSettings] = useState({
    backgroundImage: "",
    backgroundMusic: "",
  });
  const handleMoreSettings = () => {
    setAdditionalSetting(true);
  };
  const handleCloseSettings = () => {
    setAdditionalSetting(false);
  };

  const handleSettingsSubmit = (settings: {
    backgroundImage: string;
    backgroundMusic: string;
  }) => {
    setAdditionalSetting(false);
    setAdditionalSettings(settings);
    onSubmit(settings);
  };

  return (
    <div>
      <form onSubmit={submitHandler} className="flex flex-col space-y-4">
        <label className="text-lg font-medium">Study Timer:</label>
        <div className="flex space-x-2">
          <div className="flex flex-col items-center">
            <label htmlFor="minutes" className="text-sm">
              Minutes
            </label>
            <input
              type="number"
              id="minutes"
              name="minutes"
              defaultValue={0}
              min="0"
              max="59"
              className="p-2 border rounded w-20"
            />
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor="seconds" className="text-sm">
              Seconds
            </label>
            <input
              type="number"
              id="seconds"
              name="seconds"
              defaultValue={0}
              min="0"
              max="59"
              className="p-2 border rounded w-20"
            />
          </div>
        </div>
        <div className="px-1 ">
          <h1
            className="hover:cursor-pointer hover:text-blue-500"
            onClick={handleMoreSettings}
          >
            More settings
          </h1>
        </div>
        <div className="flex space-x-8">
          <button
            type="submit"
            className="p-2 bg-green-500 text-white rounded hover:scale-105"
          >
            Confirm
          </button>
          <button
            type="button"
            onClick={closeHandler}
            className="p-2 bg-red-500 text-white rounded hover:scale-105"
          >
            Close
          </button>
        </div>
      </form>
      {showAdditionalSetting && (
        <AdditionalSettingsModal
          onClose={handleCloseSettings}
          onSettingsSubmit={handleSettingsSubmit}
          backgroundImages={backgroundImages}
        />
      )}
    </div>
  );
}
