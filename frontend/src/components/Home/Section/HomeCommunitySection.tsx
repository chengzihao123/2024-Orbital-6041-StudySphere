import ChatroomList from "@/components/Chatroom/ChatroomList";
import { ChatroomProvider } from '@/components/Chatroom/ChatroomContext';

export default function HomeCommunitySection() {
  return (
    <div className="col-span-1  bg-skyBlue p-3 rounded-xl">
      <div className="mb-3 ml-2 font-bold text-xl border-b-2 border-white pb-1">
        Community
      </div>
      <ChatroomProvider>
        <ChatroomList isHome={true} />
      </ChatroomProvider>
    </div>
  );
}
