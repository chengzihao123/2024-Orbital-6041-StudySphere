"use client";
import ProtectedRoute from "@/components/ProtectedRoute";
import React from "react";

export default function TodosPage() {
  const backgroundImage = localStorage.getItem("backgroundImage");

  const backgroundImageStyle = backgroundImage
    ? `url(&apos/images/background/${backgroundImage}.jpg&apos)`
    : "";

  return (
    <ProtectedRoute>
      <div
        style={{
          backgroundImage: backgroundImageStyle,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      />
    </ProtectedRoute>
  );
}
