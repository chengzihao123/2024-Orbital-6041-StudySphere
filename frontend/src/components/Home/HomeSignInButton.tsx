"use client";
import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setTodayXP, setTotalXP } from "@/store/userProfileSlice";
import { firestore } from "../../../firebase/firebase";
import { collection, addDoc, getDocs, query, where, updateDoc, doc, Timestamp } from "firebase/firestore";
import { useAuth } from "../Auth/AuthContext";

export default function HomeSignInButton() {
  const { currentUser } = useAuth();
  const userProfile = useSelector((state: RootState) => state.userInfo);
  const { userId, totalXP, todayXP } = userProfile;
  const dispatch: AppDispatch = useDispatch();
  const [isDisabled, setIsDisabled] = useState(false);
  const [docRefId, setDocRefId] = useState<string | null>(null); 

  useEffect(() => {
    const checkLastSignIn = async () => {
      if (!currentUser) {
        console.error("User is not authenticated.");
        return;
      }

      const today = new Date().toISOString().split("T")[0];

      try {
        const q = query(collection(firestore, "rewards"), where("userId", "==", currentUser.uid), where("date", "==", today));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setIsDisabled(true);
          setDocRefId(querySnapshot.docs[0].id); 
        } else {
          const docRef = await addDoc(collection(firestore, "rewards"), {
            userId: currentUser.uid,
            dailyXP: 0,
            totalXP: totalXP,
            dailyTime: 0, 
            date: today,
            timestamp: Timestamp.now(),
          });
          setDocRefId(docRef.id); 
          setIsDisabled(false);
        }
      } catch (error) {
        console.error("Error checking last sign-in date from Firestore: ", error);
      }
    };

    checkLastSignIn();
  }, [currentUser, totalXP]);

  const handleSignIn = async () => {
    if (!currentUser) {
      console.error("User is not authenticated.");
      return;
    }

    const now = new Date();
    const today = now.toISOString().split("T")[0];
    setIsDisabled(true);

    try {
      if (docRefId) {
        const docRef = doc(firestore, "rewards", docRefId);
        await updateDoc(docRef, {
          dailyXP: todayXP + 10,
          totalXP: totalXP + 10,
          timestamp: Timestamp.now(), 
        });

        dispatch(setTodayXP(todayXP + 10));
        dispatch(setTotalXP(totalXP + 10));
      } else {
        console.error("Document reference ID is null.");
      }
    } catch (error) {
      console.error("Error updating XP document: ", error);
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
