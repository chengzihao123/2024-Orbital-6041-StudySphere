"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import {
  setIsFullscreen,
  setIsUserTime,
  setCountdownSeconds,
  setBackgroundSettings,
} from "@/store/slice";
import CountdownTimer from "@/components/Timer";
import UserSetStudyTimer from "@/components/UserSetStudyTimer";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Study() {
  const backgroundImages = ["", "autumn", "grass", "sea", "mountain", "moon"];

  const backgroundImagesMap: { [key: string]: string } = {
    autumn:
      "https://images.pexels.com/photos/33109/fall-autumn-red-season.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    grass:
      "https://images.pexels.com/photos/352096/pexels-photo-352096.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    sea: "https://images.pexels.com/photos/1766838/pexels-photo-1766838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    mountain:
      "https://images.pexels.com/photos/36478/amazing-beautiful-beauty-blue.jpg",
    moon: "https://images.pexels.com/photos/884788/pexels-photo-884788.jpeg",
  };
  const dispatch: AppDispatch = useDispatch();
  const { isFullscreen, isUserTime, countdownSeconds, backgroundSettings } =
    useSelector((state: RootState) => state.timer);

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
    // setIsFullscreen(false);
    // setUserTime(false);
    // setCountdownSecond(0);
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
  };

  const exitFullscreen = () => {
    // setIsFullscreen(false);
    // setUserTime(false);
    handleFullscreenToggle();
    if (isUserTime) {
      handleUserTimeToggle();
    }
    document.exitFullscreen();
  };

  const handleCloseForm = () => {
    // setUserTime(false);
    handleUserTimeToggle();
  };

  const getBackgroundImageUrl = (imageName: string) => {
    return backgroundImagesMap[imageName] || "";
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

        {isFullscreen && (
          <div
            style={{
              backgroundImage: `url()`,
              // backgroundImage: `url(${getBackgroundImageUrl(
              //   backgroundSettings.backgroundImage
              // )})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              height: "100vh",
              width: "100vw",
            }}
          >
            <div className="p-5">
              <div className="inline-block">
                <CountdownTimer
                  onTimeUp={exitFullscreen}
                  initialTime={countdownSeconds}
                />
              </div>
              <div className="inline-block float-right">
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full"
                  onClick={exitFullscreen}
                >
                  End Study
                </button>
              </div>
            </div>
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
      </div>
    </ProtectedRoute>
  );
}
