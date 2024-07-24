import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setpomodoroCycleLeft } from "@/store/timerSlice";
import { useTimer } from "react-timer-hook";
import { FaPause, FaPlay } from "react-icons/fa6";
import { collection, getDocs, query, updateDoc, where, Timestamp } from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import { useAuth } from "../../Auth/AuthContext";

type PomodoroPatternTimerProps = {
  onTimeUp: () => void;
  isStudyCycle: boolean;
  setStudyCycle: React.Dispatch<React.SetStateAction<boolean>>;
  onCycleComplete: () => void;
};

export default function PomodoroPatternTimer({
  onTimeUp,
  isStudyCycle,
  setStudyCycle,
  onCycleComplete,
}: PomodoroPatternTimerProps) {
  const router = useRouter();
  const [isPaused, setIsPaused] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const { pomodoroCycleLeft } = useSelector((state: RootState) => state.timer);
  const { currentUser } = useAuth();

  const studyTimer = new Date();
  studyTimer.setSeconds(studyTimer.getSeconds() + 1500);

  const { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp: studyTimer,
    onExpire: async () => {
      if (isStudyCycle) {
        // Study cycle completed
        const today = new Date().toISOString().split("T")[0];
        try {
          const q = query(collection(firestore, "rewards"), where("userId", "==", currentUser?.uid), where("date", "==", today));
          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const docRef = querySnapshot.docs[0].ref;
            const currentDailyCycle = querySnapshot.docs[0].data().dailyCycle || 0;
            await updateDoc(docRef, {
              dailyCycle: currentDailyCycle + 1,
              timestamp: Timestamp.now(),
            });
          }
        } catch (error) {
          console.error("Error updating daily cycle in Firestore: ", error);
        }

        const restTimer = new Date();
        restTimer.setSeconds(restTimer.getSeconds() + 300);
        setStudyCycle(false);
        restart(restTimer);
        resume();
        router.push("/study/background/break");
      } else {
        // Break cycle completed
        onCycleComplete();
        if (pomodoroCycleLeft == 1) {
          onTimeUp();
          router.push("/study/summary");
        } else {
          dispatch(setpomodoroCycleLeft(pomodoroCycleLeft - 1));
          setStudyCycle(true);
          const studyTimer = new Date();
          studyTimer.setSeconds(studyTimer.getSeconds() + 1500);
          restart(studyTimer);
          resume();
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
