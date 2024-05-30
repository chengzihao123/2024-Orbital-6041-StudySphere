import Link from 'next/link';
import LoginTopBar from "@/components/LoginTopBar";
import MainLogo from "@/components/MainLogo";
import Image from "next/image";
import RootLayout from "./layout";

export default function Login() {
  return (
    <RootLayout>
      <div className="relative">
        <Image
          src="/images/shapes.jpg"
          alt="shapes background"
          layout="fill"
          objectFit="cover"
          className="absolute top-0 left-0 opacity-25 z-0"
        />
        <div className="flex items-center justify-center flex-col relative z-10">
          <LoginTopBar />
          <div className="flex flex-col w-full items-center pt-3">
            <div className="text-7xl font-semibold mt-4">Welcome to</div>
            <MainLogo />
          </div>
        </div>
      </div>
    </RootLayout>
  );
}