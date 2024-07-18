"use client";
import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setTodayXP, setTotalXP } from "@/store/userProfileSlice";

export default function HomeSignInButton() {
  const userProfile = useSelector((state: RootState) => state.userInfo);
  const { totalXP, todayXP } = userProfile;
  const dispatch: AppDispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // transfer to backend
    const lastSignIn = localStorage.getItem("lastSignIn");
    if (lastSignIn) {
      const lastSignInDate = new Date(lastSignIn);
      const today = new Date();
      if (
        lastSignInDate.getDate() === today.getDate() &&
        lastSignInDate.getMonth() === today.getMonth() &&
        lastSignInDate.getFullYear() === today.getFullYear()
      ) {
        setIsDisabled(true);
      }
    }
  }, []);

  const handleSignIn = () => {
    const now = new Date();
    localStorage.setItem("lastSignIn", now.toISOString());
    setIsDisabled(true);
    dispatch(setTodayXP(todayXP + 10));
    dispatch(setTotalXP(totalXP + 10));
  };

  return (
    <div
      className={`flex items-center cursor-pointer border-2 p-2 pt-1 border-slate-400 rounded-lg hover:scale-105 ${
        isDisabled && "cursor-not-allowed opacity-50 hover:scale-100"
      }`}
      onClick={!isDisabled ? handleSignIn : undefined}
    >
      <div className="mr-2 font-bold">sign in</div>
      <MdCheckCircleOutline className="mt-1" />
    </div>
  );
}
