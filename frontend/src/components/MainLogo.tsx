import Image from "next/image";

export default function MainLogo() {
  return (
    <div className="flex items-center justify-center flex-col">
      <Image
        src={"/images/background.png"}
        alt="background image"
        width={400}
        height={200}
      />
      <h1 className="relative text-4xl top-[-290px] left-[-10px] font-main font-bold">
        Study Sphere
      </h1>
    </div>
  );
}
