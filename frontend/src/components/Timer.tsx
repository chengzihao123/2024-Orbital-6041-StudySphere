import { useState, useEffect } from "react";

type CountdownTimerProps = {
  initialTime: number;
  onTimeUp: () => void;
};

export default function CountdownTimer({
  onTimeUp,
  initialTime,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    setTimeLeft(initialTime); // Reset the timer when initialTime changes
  }, [initialTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [onTimeUp]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes > 9 ? minutes : `0${minutes}`}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg shadow-md p-5 max-w-sm mx-auto">
      <h1 className="text-3xl font-extrabold mb-2 tracking-wider">Time Left</h1>
      <div className="text-5xl font-mono bg-gray-900 py-2 px-4 rounded-lg shadow-inner">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}
