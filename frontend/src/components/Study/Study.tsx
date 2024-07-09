import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState, AppDispatch } from "@/store/store";
import {
  setIsFullscreen,
  setIsUserTime,
  setCountdownSeconds,
} from "@/store/timerSlice";
import UserSetStudyTimer from "./UserSetStudyTimer";
import ProtectedRoute from "../ProtectedRoute";
import TimeZeroAlert from "../Modal/TimeZeroAlert";
import StudyLandingPage from "./StudyLandingPage";
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
    router.push("/study/background");
  };
  const handleCloseForm = () => {
    handleUserTimeToggle();
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center">
        {!isFullscreen && <StudyLandingPage userSetTime={userSetTime} />}
        {isUserTime && (
          <UserSetStudyTimer
            submitHandler={handleSubmitForm}
            closeHandler={handleCloseForm}
            backgroundImages={backgroundImages}
          />
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
