import ChatroomList from "@/components/Chatroom/ChatroomList";

export default function HomeCommunitySection() {
  return (
    <div className="col-span-1  bg-red-400 p-3 rounded-xl">
      <div className="mb-3 ml-2 font-bold text-xl border-b-2 border-white pb-1">
        Community
      </div>
      <ChatroomList isHome={true} />
    </div>
  );
}
