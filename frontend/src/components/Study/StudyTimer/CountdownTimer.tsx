"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setStudyTime, setTodayXP, setTotalXP, setHasAwardedDailyTimeXP } from "@/store/timerSlice";
import { useTimer } from "react-timer-hook";
import { FaPause, FaPlay, FaStop } from "react-icons/fa6"; 
import { collection, getDocs, query, updateDoc, where, Timestamp, addDoc } from "firebase/firestore";
import { firestore } from "../../../../firebase/firebase";
import { useAuth } from "../../Auth/AuthContext";
import { RootState } from "@/store/store"; 

type CountdownTimerProps = {
  initialTime: number;
  onTimeUp: () => void;
  onTotalSecondsUpdate: (seconds: number) => void;
};

export default function CountdownTimer({
  onTimeUp,
  initialTime,
  onTotalSecondsUpdate,
}: CountdownTimerProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useAuth();
  const { hasAwardedDailyTimeXP } = useSelector((state: RootState) => state.timer); // Access state
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + initialTime);

  const { seconds, minutes, pause, resume, restart, totalSeconds } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      handleTimerEnd(initialTime);
    },
  });

  const getTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      timeZone: 'Asia/Singapore'
    };
    const formattedDate = new Intl.DateTimeFormat('en-GB', options).format(today).split('/').reverse().join('-');
    return formattedDate;
  };

  const handleTimerEnd = async (elapsedTime: number) => {
    if (currentUser) {
      const today = getTodayDate();
      try {
        const q = query(collection(firestore, "rewards"), where("userId", "==", currentUser.uid), where("date", "==", today));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          const data = querySnapshot.docs[0].data();
          const currentDailyTime = data.dailyTime || 0;
          const totalDailyTime = currentDailyTime + elapsedTime;

          const updates: any = {
            dailyTime: totalDailyTime,
            timestamp: Timestamp.now(),
          };

          if (totalDailyTime >= 3600 && !hasAwardedDailyTimeXP) {
            updates.dailyXP = (data.dailyXP || 0) + 10;
            updates.totalXP = (data.totalXP || 0) + 10;
            dispatch(setTodayXP((data.dailyXP || 0) + 10));
            dispatch(setTotalXP((data.totalXP || 0) + 10));
            dispatch(setHasAwardedDailyTimeXP(true)); 
          }

          await updateDoc(docRef, updates);
        } else {
          await addDoc(collection(firestore, "rewards"), {
            userId: currentUser.uid,
            dailyXP: 0,
            totalXP: 0,
            dailyTime: elapsedTime,
            date: today,
            dailyCycle: 0,
            hasAwardedDailyTimeXP: false,
            hasAwardedCycleXP: false,
            timestamp: Timestamp.now(),
          });
        }
      } catch (error) {
        console.error("Error updating daily time in Firestore: ", error);
      }
    }

    onTimeUp();
    dispatch(setStudyTime(elapsedTime));
    router.push("/study/summary");
  };

  const handlePrematureEnd = () => {
    pause();
    handleTimerEnd(initialTime - totalSeconds);
  };

  useEffect(() => {
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(newExpiryTimestamp.getSeconds() + initialTime);
    restart(newExpiryTimestamp);
  }, [initialTime, restart]);

  useEffect(() => {
    onTotalSecondsUpdate(totalSeconds);
    dispatch(setStudyTime(initialTime - totalSeconds));
  }, [totalSeconds, onTotalSecondsUpdate, dispatch, initialTime]);

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes > 9 ? minutes : `0${minutes}`}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg shadow-md px-3 py-1 max-w-xs mx-auto">
      <h1 className="text-sm font-bold mb-2 tracking-wider">Time Left</h1>
      <div className="text-lg font-mono bg-gray-900 py-2 px-4 rounded-lg shadow-inner">
        {formatTime(minutes, seconds)}
      </div>
      <div className="flex flex-row justify-between w-3/4 mt-1">
        <FaPause onClick={pause} className="cursor-pointer" />
        <FaPlay onClick={resume} className="cursor-pointer" />
        <FaStop onClick={handlePrematureEnd} className="cursor-pointer" /> {/* Added stop button */}
      </div>
    </div>
  );
}
