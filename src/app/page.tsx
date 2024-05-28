import LoginTopBar from "@/components/LoginTopBar";
import MainLogo from "@/components/MainLogo";
import Image from "next/image";
export default function Login() {
  return (
    <div className="flex items-center justify-center flex-col relative">
      <LoginTopBar />
      <div className="flex flex-col relative w-full items-center pt-3">
        <div className="text-7xl font-semibold mt-4">Welcome to</div>
        <MainLogo />
        <Image
          src="/images/shapes.jpg"
          alt="shapes background"
          layout="fill"
          objectFit="cover"
          className="absolute top-0 left-0 opacity-25"
        />
      </div>
    </div>
  );
}
