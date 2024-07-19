"use client";
import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setTodayXP, setTotalXP } from "@/store/userProfileSlice";
import { firestore } from "../../../firebase/firebase";
import { collection, addDoc, getDocs, query, where, Timestamp } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";

export default function HomeSignInButton() {
  const { currentUser } = useAuth();
  const userProfile = useSelector((state: RootState) => state.userInfo);
  const { userId, totalXP, todayXP } = userProfile;
  const dispatch: AppDispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const checkLastSignIn = async () => {
      if (!currentUser) {
        console.error("User is not authenticated.");
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      try {
        // Check if an entry for today already exists in Firestore
        const q = query(collection(firestore, "rewards"), where("userId", "==", currentUser.uid), where("date", "==", today));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
      } catch (error) {
        console.error("Error checking last sign-in date from Firestore: ", error);
      }
    };

    // Check the last sign-in when the component mounts
    checkLastSignIn();
  }, [currentUser]);

  const handleSignIn = async () => {
    if (!currentUser) {
      console.error("User is not authenticated.");
      return;
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    setIsDisabled(true);

    try {
      // Add a new entry for today
      await addDoc(collection(firestore, "rewards"), {
        userId: currentUser.uid,
        dailyXP: todayXP + 10,
        totalXP: totalXP + 10,
        date: today,
        timestamp: Timestamp.now(),
      });

      // Update the state locally
      dispatch(setTodayXP(todayXP + 10));
      dispatch(setTotalXP(totalXP + 10));
    } catch (error) {
      console.error("Error creating XP document: ", error);
    }
  };

  return (
    <div
      className={`flex items-center cursor-pointer border-2 p-2 pt-1 border-slate-400 rounded-lg hover:scale-105 ${
        isDisabled ? "cursor-not-allowed opacity-50 hover:scale-100" : ""
      }`}
      onClick={!isDisabled ? handleSignIn : undefined}
    >
      <div className="mr-2 font-bold">sign in</div>
      <MdCheckCircleOutline className="mt-1" />
    </div>
  );
}
