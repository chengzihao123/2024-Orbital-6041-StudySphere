import HomeStudyChart from "../HomeStudyChart";
import HomeButton from "../HomeButton";

export default function HomeStudySection() {
  return (
    <div className="col-span-1 bg-lightBlue p-3 rounded-xl">
      <div className="mb-3 ml-2 font-bold text-xl border-b-2 border-white pb-1">
        Study
      </div>
      <div style={{ height: "270px" }}>
        <HomeStudyChart />
      </div>
      <HomeButton web={"/study"} buttonText={"Continue to study"} />
    </div>
  );
}
