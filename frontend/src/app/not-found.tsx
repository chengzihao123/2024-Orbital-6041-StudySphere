"use client"
import { useEffect } from &aposreact&apos;
import { useRouter } from &aposnext/navigation&apos;

const NotFoundPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(&apos/&apos);
  }, [router]);

  return null;
};

export default NotFoundPage;
