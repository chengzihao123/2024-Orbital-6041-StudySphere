"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import CountdownTimer from "@/components/Timer";

export default function Study() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // When first initiated, the page is not in fullscreen
  useEffect(() => {
    setIsFullscreen(false);
  }, []);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (!document.fullscreenElement) {
      elem.requestFullscreen();
    }
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    setIsFullscreen(false);
    document.exitFullscreen();
  };

  const handleTimeUp = () => {
    setIsFullscreen(false);
    document.exitFullscreen();
  };

  return (
    <div className="flex justify-between p-5">
      {/* page is not in fullscreen */}
      {!isFullscreen && (
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          onClick={enterFullscreen}
        >
          <span>Start to Study</span>
        </button>
      )}
      {!isFullscreen && <Link href="/">⬅️go back</Link>}

      {/* page is in fullscreen */}
      {isFullscreen && <CountdownTimer onTimeUp={handleTimeUp} />}
      {isFullscreen && (
        <div>
          <button
            className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            onClick={exitFullscreen}
          >
            End study
          </button>
        </div>
      )}
    </div>
  );
}
