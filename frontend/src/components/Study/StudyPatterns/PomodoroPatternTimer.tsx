import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setPomodoroCycle } from "@/store/timerSlice";
import { useTimer } from "react-timer-hook";
import { FaPause, FaPlay } from "react-icons/fa6";

type PomodoroPatternTimerProps = {
  onTimeUp: () => void;
  isStudyCycle: boolean;
  setStudyCycle: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PomodoroPatternTimer({
  onTimeUp,
  isStudyCycle,
  setStudyCycle,
}: PomodoroPatternTimerProps) {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { pomodoroCycle } = useSelector((state: RootState) => state.timer);

  const studyTimer = new Date();
  studyTimer.setSeconds(studyTimer.getSeconds() + 1500);

  const { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp: studyTimer,
    onExpire: async () => {
      if (isStudyCycle) {
        const restTimer = await new Date();
        restTimer.setSeconds(restTimer.getSeconds() + 300);
        setStudyCycle(false);
        restart(restTimer);
        resume;
        router.push("/study/background/break");
      } else {
        if (pomodoroCycle == 1) {
          onTimeUp();
          router.push("/study/summary");
        } else {
          dispatch(setPomodoroCycle(pomodoroCycle - 1));
          setStudyCycle(true);
          const restTimer = await new Date();
          restTimer.setSeconds(restTimer.getSeconds() + 1500);
          restart(restTimer);
          resume;
          router.push("/study/background");
        }
      }
    },
  });

  const handlePause = () => {
    pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    resume();
    setIsPaused(false);
  };

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes > 9 ? minutes : `0${minutes}`}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  };

  const isTimeLow = minutes === 0 && seconds < 10;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg shadow-md px-3 py-1 max-w-xs mx-auto">
      <h1 className="text-sm font-bold mb-2 tracking-wider">Time Left</h1>
      <div className="flex items-center">
        <span className="text-lg font-mono mr-2">
          {isStudyCycle ? "Study Time:" : "Break Time:"}
        </span>
        <div
          className={`flex items-center bg-gray-900 py-2 px-4 rounded-lg shadow-inner ${
            isTimeLow ? "text-red-500" : ""
          } ${isTimeLow && !isPaused ? "animate-blink" : ""}`}
        >
          <span className="text-lg font-mono">
            {formatTime(minutes, seconds)}
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between w-3/4 mt-1">
        <FaPause onClick={handlePause} className="cursor-pointer" />
        <FaPlay onClick={handleResume} className="cursor-pointer" />
      </div>
    </div>
  );
}
