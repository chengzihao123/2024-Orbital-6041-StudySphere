import React, { useState } from "react";

type PomodoroModalProps = {
  onConfirm: (cycles: number) => void;
  onClose: () => void;
};

export default function PomodoroModal({
  onConfirm,
  onClose,
}: PomodoroModalProps) {
  const [cycles, setCycles] = useState(1);

  const handleCycleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCycles(Number(e.target.value));
  };

  const handleConfirm = () => {
    onConfirm(cycles);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-h-screen overflow-y-auto w-1/2">
        <h2 className="text-xl font-bold mb-4">Pomodoro Technique</h2>
        <p className="mb-4">
          The Pomodoro Technique is a time management method that involves
          breaking work into intervals, traditionally 25 minutes in length,
          separated by short breaks. Each interval is known as a Pomodoro.
        </p>
        <label htmlFor="cycles" className="text-lg">
          Number of Pomodoro cycles:
        </label>
        <select
          id="cycles"
          name="cycles"
          className="p-2 border rounded w-full"
          value={cycles}
          onChange={handleCycleChange}
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <div className="flex justify-between mt-5">
          <button
            onClick={handleConfirm}
            className="p-2 bg-green-500 text-white rounded hover:scale-105"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-red-500 text-white rounded hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
