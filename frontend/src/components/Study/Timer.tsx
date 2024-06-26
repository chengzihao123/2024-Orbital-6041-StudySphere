import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CountdownTimerProps = {
  initialTime: number;
  onTimeUp: () => void;
};

export default function CountdownTimer({
  onTimeUp,
  initialTime,
}: CountdownTimerProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    // Reset the timer and start the countdown when initialTime changes
    setTimeLeft(initialTime);
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          onTimeUp();
          router.push("/study"); // Navigate to /study when timer reaches zero
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime, router]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes > 9 ? minutes : `0${minutes}`}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 text-white rounded-lg shadow-md px-3 py-1 max-w-xs mx-auto">
      <h1 className="text-sm font-bold mb-2 tracking-wider">Time Left</h1>
      <div className="text-lg font-mono bg-gray-900 py-2 px-4 rounded-lg shadow-inner">
        {formatTime(timeLeft)}
      </div>
    </div>
  );
}
