import React, { useEffect, useState } from "react";
import { firestore } from "../../../../firebase/firebase";
import { collectionGroup, query, where, getDocs, Timestamp } from "firebase/firestore";
import { useAuth } from "@/components/Auth/AuthContext";

export default function VSSCommunitySection() {
  const { currentUser } = useAuth();
  const [answeredCount, setAnsweredCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const fetchCommunityData = async () => {
      const today = new Date();
      const startDate = new Date();
      startDate.setDate(today.getDate() - 6); 

      const startTimestamp = Timestamp.fromDate(startDate);

      try {
        const answersQuery = query(
          collectionGroup(firestore, "answers"),
          where("userId", "==", currentUser.uid),
        );
        const querySnapshot = await getDocs(answersQuery);

        if (querySnapshot.empty) {
          console.log("No matching documents.");
          setAnsweredCount(0);
          return;
        }

        querySnapshot.forEach(doc => {
          console.log(&aposRetrieved doc:&apos, doc.data());
        });

        const answersCount = querySnapshot.size;
        setAnsweredCount(answersCount);
      } catch (error) {
        console.error("Error fetching community data: ", error);
      }
    };

    fetchCommunityData();
  }, [currentUser]);

  return (
    <div className="w-full p-5 border-2 rounded-xl mr-10">
      <div className="flex justify-center text-xl mb-2 pb-2 border-b-2 border-teal-500">
        Weekly Community Summary
      </div>
      <div className="flex justify-center my-5 text-center">
        For this whole week you have answered {answeredCount} questions
      </div>
    </div>
  );
}
