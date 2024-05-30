import Link from "next/link";

export default function LoginTopBar() {
  return (
    <div className="flex justify-end w-full h-10 bg-black rounded-sm pt-1 pr-7">
      <div className="w-full pl-10 pt-1 space-x-4">
        <Link
          href="/study"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full"
        >
          Study
        </Link>
        <Link
          href="/todo"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full"
        >
          Tracker
        </Link>
      </div>
      <h1 className="text-lg font-bold text-white mr-7 hover:text-xl cursor-pointer">
        Login
      </h1>
      <h1 className="text-lg font-bold text-white hover:text-xl cursor-pointer">
        sign up
      </h1>
    </div>
  );
}
