"use client";
import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setTodayXP, setTotalXP } from "@/store/userProfileSlice";
import { firestore } from "../../../firebase/firebase";
import { collection, addDoc, updateDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';

export default function HomeSignInButton() {
  const userProfile = useSelector((state: RootState) => state.userInfo);
  const { userId, totalXP, todayXP } = userProfile;
  const dispatch: AppDispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    const checkLastSignIn = async () => {
      const lastSignIn = localStorage.getItem(`lastSignIn-${userId}`);
      if (lastSignIn) {
        const lastSignInDate = new Date(lastSignIn);
        const today = new Date();
        if (
          lastSignInDate.getDate() === today.getDate() &&
          lastSignInDate.getMonth() === today.getMonth() &&
          lastSignInDate.getFullYear() === today.getFullYear()
        ) {
          setIsDisabled(true);
        } else {
          setIsDisabled(false);
        }
      }
    };
    checkLastSignIn();
  }, [userId]);

  const handleSignIn = async () => {
    const now = new Date();
    localStorage.setItem(`lastSignIn-${userId}`, now.toISOString());
    setIsDisabled(true);

    // update the state locally
    dispatch(setTodayXP(todayXP + 10));
    dispatch(setTotalXP(totalXP + 10));

    // get today's date as a string
    const today = new Date().toISOString().split('T')[0];

    try {
      // check if an entry for today already exists
      const q = query(collection(firestore, 'rewards'), where('userId', '==', userId), where('date', '==', today));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // if an entry exists, update it
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          dailyXP: todayXP + 10,
          totalXP: totalXP + 10,
        });
      } else {
        // if no entry exists, create a new one
        await addDoc(collection(firestore, 'rewards'), {
          userId: userId,
          dailyXP: todayXP + 10,
          totalXP: totalXP + 10,
          date: today,
          timestamp: Timestamp.now()
        });
      }
    } catch (error) {
      console.error("Error updating XP: ", error);
    }
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
