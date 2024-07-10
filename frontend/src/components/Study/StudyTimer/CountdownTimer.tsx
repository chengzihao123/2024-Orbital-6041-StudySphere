import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTimer } from "react-timer-hook";
import { FaPause, FaPlay } from "react-icons/fa6";

type CountdownTimerProps = {
  initialTime: number;
  onTimeUp: () => void;
};

export default function CountdownTimer({
  onTimeUp,
  initialTime,
}: CountdownTimerProps) {
  const router = useRouter();

  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + initialTime);

  const { seconds, minutes, pause, resume, restart } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      onTimeUp();
      router.push("/study"); // Navigate to /study when timer reaches zero
    },
  });

  useEffect(() => {
    const newExpiryTimestamp = new Date();
    newExpiryTimestamp.setSeconds(
      newExpiryTimestamp.getSeconds() + initialTime
    );
    restart(newExpiryTimestamp);
  }, [initialTime, restart]);

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes > 9 ? minutes : `0${minutes}`}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg shadow-md px-3 py-1 max-w-xs mx-auto">
      <h1 className="text-sm font-bold mb-2 tracking-wider">Time Left</h1>
      <div className="text-lg font-mono bg-gray-900 py-2 px-4 rounded-lg shadow-inner">
        {formatTime(minutes, seconds)}
      </div>
      <div className=" flex flex-row justify-between w-3/4 mt-1">
        <FaPause onClick={pause} className="cursor-pointer" />
        <FaPlay onClick={resume} className="cursor-pointer" />
      </div>
    </div>
  );
}
