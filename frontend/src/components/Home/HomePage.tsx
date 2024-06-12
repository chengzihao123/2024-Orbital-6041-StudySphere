"use client";
import React, { useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";

const HomePage: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();
  const { signup, loginWithGoogle } = auth || {};
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailRef.current && passwordRef.current && signup) {
      try {
        await signup(emailRef.current.value, passwordRef.current.value);
        router.push("/todos");
      } catch (error) {
        console.error("Failed to create an account", error);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (loginWithGoogle) {
        await loginWithGoogle();
        router.push("/todos");
      }
    } catch (error) {
      console.error("Failed to log in with Google", error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/background-home.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-black">Study Sphere</h2>
          <p className="text-lg text-black mb-4">
            Transform Your Study Experience Now
          </p>
          <Link href="/login" className="bg-black text-white py-2 px-4 rounded inline-block">
            Enter Study Sphere
          </Link>
        </div>
        <h3 className="text-xl font-bold mb-4 text-black">Create an account</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            ref={emailRef}
            placeholder="Email"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="password"
            ref={passwordRef}
            placeholder="Password"
            className="w-full mb-4 p-2 border border-gray-300 rounded"
            required
          />
          <button className="w-full bg-black text-white py-2 rounded">
            Sign up with email
          </button>
        </form>
        <div className="my-4 text-center text-black">or continue with</div>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-white text-black py-2 border border-gray-300 rounded flex items-center justify-center"
        >
          <img src="/images/google-icon.png" alt="Google" className="h-6 mr-2" />
          Google
        </button>
        <p className="text-xs text-gray-600 mt-4">
          By clicking continue, you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default HomePage;
