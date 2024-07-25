import VSSstudyGraph from "../misc/VSSstudyGraph";
export default function VSSstudySection() {
  return (
    <div className="w-full mr-10 p-5 rounded-xl border-2 ">
      <div className="flex justify-center text-xl mb-2 pb-2 border-b-2 border-teal-500">
        Weekly Study Summary
      </div>
      <div className="flex justify-center mb-5 mt-3">
        For this whole week you have studied for more than 152 minutes
      </div>
      <VSSstudyGraph />
    </div>
  );
}
