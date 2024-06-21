"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setBackgroundSettings, setShowAdditionalSetting } from "@/store/slice";
import AdditionalSettingsModal from "./Modal/AdditionalSetting";

type UserSetStudyTimerProps = {
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
  closeHandler: () => void;
  backgroundImages: string[];
};

export default function UserSetStudyTimer({
  submitHandler,
  closeHandler,
  backgroundImages,
}: UserSetStudyTimerProps) {
  const dispatch: AppDispatch = useDispatch();
  const { showAdditionalSetting } = useSelector(
    (state: RootState) => state.timer
  );

  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleMoreSettings = () => {
    dispatch(setShowAdditionalSetting(true));
  };

  const handleCloseSettings = () => {
    dispatch(setShowAdditionalSetting(false));
  };

  const handleSettingsSubmit = (settings: {
    backgroundImage: string;
    backgroundMusic: string;
  }) => {
    handleCloseSettings();
    dispatch(setBackgroundSettings(settings));
  };

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMinutes(Number(e.target.value));
    if (error) setError(null); // Clear error when user changes input
  };

  const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeconds(Number(e.target.value));
    if (error) setError(null); // Clear error when user changes input
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
              value={minutes}
              onChange={handleMinutesChange}
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
              value={seconds}
              onChange={handleSecondsChange}
              min="0"
              max="59"
              className="p-2 border rounded w-20"
            />
          </div>
        </div>
        {error && <p className="text-red-500">{error}</p>}
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
