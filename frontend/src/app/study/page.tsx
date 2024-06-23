"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import {
  setIsFullscreen,
  setIsUserTime,
  setCountdownSeconds,
} from "@/store/timerSlice";
import UserSetStudyTimer from "@/components/Study/UserSetStudyTimer";
import ProtectedRoute from "@/components/ProtectedRoute";
import TimeZeroAlert from "@/components/Modal/TimeZeroAlert";
export default function Study() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);
  const backgroundImages = ["", "autumn", "grass", "sea", "mountain", "moon"];

  const dispatch: AppDispatch = useDispatch();
  const { isFullscreen, isUserTime } = useSelector(
    (state: RootState) => state.timer
  );

  const handleFullscreenToggle = () => {
    dispatch(setIsFullscreen(!isFullscreen));
  };

  const handleUserTimeToggle = () => {
    dispatch(setIsUserTime(!isUserTime));
  };

  const handleCountdownChange = (seconds: number) => {
    dispatch(setCountdownSeconds(seconds));
  };

  useEffect(() => {
    if (isFullscreen) {
      handleFullscreenToggle();
    }
    if (isUserTime) {
      handleUserTimeToggle();
    }
    handleCountdownChange(0);
  }, []);

  const userSetTime = () => {
    if (!isUserTime) {
      handleUserTimeToggle();
    }
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const minutes = Number(
      (form.elements.namedItem("minutes") as HTMLInputElement).value
    );
    const seconds = Number(
      (form.elements.namedItem("seconds") as HTMLInputElement).value
    );

    if (minutes === 0 && seconds === 0) {
      setShowAlert(true); // Show alert if both minutes and seconds are zero
      return;
    }

    const totalSeconds = minutes * 60 + seconds;
    handleCountdownChange(totalSeconds);
    handleUserTimeToggle();
    enterFullscreen();
  };

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    }
    handleFullscreenToggle();
    router.push("/background");
  };
  const handleCloseForm = () => {
    handleUserTimeToggle();
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center">
        {!isFullscreen && (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center mb-8 mt-20">
              <h1 className="text-5xl font-bold mb-10 mt-20">
                Deep study starts here
              </h1>
              <p className="text-3xl mb-10">Are you ready to focus?</p>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full mb-5"
              onClick={userSetTime}
            >
              Start to Study
            </button>

            <Link href="/" className="text-blue-500 hover:text-blue-700">
              Go back
            </Link>
          </div>
        )}

        {isUserTime && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg max-h-screen overflow-y-auto">
              <UserSetStudyTimer
                submitHandler={handleSubmitForm}
                closeHandler={handleCloseForm}
                backgroundImages={backgroundImages}
              />
            </div>
          </div>
        )}

        {showAlert && (
          <TimeZeroAlert
            message="Time can't be set as 0. Please enter a valid time."
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
