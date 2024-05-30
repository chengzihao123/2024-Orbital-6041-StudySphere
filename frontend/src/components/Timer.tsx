// components/CountdownTimer.js
import { useState, useEffect } from "react";

type CountdownTimerProps = {
  onTimeUp: () => void;
};

export default function CountdownTimer({ onTimeUp }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds

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
  }, []);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 px-10">
      <h1 className="text-4xl font-bold mb-4">Time left</h1>
      <div className="text-6xl font-mono">{formatTime(timeLeft)}</div>
    </div>
  );
}
