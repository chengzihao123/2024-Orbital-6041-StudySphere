"use client";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TodosPage() {
  const backgroundImage = localStorage.getItem("backgroundImage");
  return (
    <ProtectedRoute>
      <div
        style={{
          backgroundImage: `url('/images/background/${backgroundImage}.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          width: "100%",
          height: "100%",
          position: "fixed",
        }}
      />
    </ProtectedRoute>
  );
}
