"use client";
import VSSstudySection from "./VSSstudySection";
import VSStodoSection from "./VSStodoSection";
import VSSCommunitySection from "./VSSCommunitySection";
import VSSRewardSection from "./VSSRewardSection";

export default function VSSMainPage() {
  return (
    <>
      <div className="mb-5 text-xl flex justify-center">Past week activity</div>
      <div className="grid grid-cols-8 mb-10">
        <div className="col-span-1" />
        <div className="flex flex-row col-span-6">
          <VSSstudySection />
          <VSStodoSection />
        </div>
        <div className="col-span-1" />
      </div>
      <div className="grid grid-cols-8 mb-10">
        <div className="col-span-1" />
        <div className="flex flex-row col-span-6">
          <VSSCommunitySection />
          <VSSRewardSection />
        </div>
        <div className="col-span-1" />
      </div>
    </>
  );
}
