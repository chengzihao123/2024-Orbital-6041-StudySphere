import React from "react";
import Link from "next/link";

export default function SummaryPage() {
  return (
    <div
      className="flex flex-col justify-center items-center"
      style={{ minHeight: "calc(100vh - 100px)" }}
    >
      <div className="text-4xl font-bold text-center">
        Congratulation! You have studied for 50 minutes
      </div>
      <Link
        href="/study"
        className="absolute bottom-5 right-10 text-blue-500 hover:text-blue-700 text-lg"
      >
        Go back
      </Link>
    </div>
  );
}
