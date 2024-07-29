"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./Auth/AuthContext";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { currentUser } = useAuth()!;
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace("/");
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
