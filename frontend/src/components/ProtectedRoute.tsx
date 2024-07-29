"use client"
import { useEffect } from &aposreact&apos;
import { useRouter } from &aposnext/navigation&apos;
import { useAuth } from &apos./Auth/AuthContext&apos; 

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth()!;
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace(&apos/&apos);
    }
  }, [currentUser, router]);

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
