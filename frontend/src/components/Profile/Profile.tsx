import { useAuth } from "@/components/Auth/AuthContext";
import HomeAvatar from "@/components/Home/HomeAvatar";
import ProfileFields from "@/components/Profile/ProfileFields";
import { Tooltip } from "@chakra-ui/react";
import { FaEdit } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { profile } = useAuth() || {};

  // Sample user particulars
  const particulars = {
    name: profile?.displayName ?? "John Doe",
    nickname: "Johnny",
    yearOfStudy: "3",
    faculty: "Engineering",
    major: "Chemical engineering",
    hobby: "Reading",
    cca: "Basketball",
    birthday: "22/04",
  };

  const handleEditProfile = () => {
    router.push("/profile/particulars");
  };

  return (
    <>
      <div className="flex flex-col items-center mb-5">
        <HomeAvatar classes="mt-2" isHome={false} />
        <div className="mt-4">
          <h1 className="text-xl font-main font-semibold">
            {profile?.displayName ?? ""}
          </h1>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="w-[1000px] h-96 border-2 border-slate-400 p-5">
          <h2 className="text-2xl font-semibold mb-10 border-b-2 border-slate-400 pb-2">
            User Particulars
          </h2>
          <div className="grid grid-cols-2 gap-y-2">
            <ProfileFields fieldName="name" fieldDetails={particulars.name} />
            <ProfileFields
              fieldName="Nickname"
              fieldDetails={particulars.nickname}
            />
            <ProfileFields
              fieldName="Birth date"
              fieldDetails={particulars.birthday}
            />
            <ProfileFields
              fieldName="Years of Study"
              fieldDetails={particulars.yearOfStudy}
            />
            <ProfileFields
              fieldName="Faculty"
              fieldDetails={particulars.faculty}
            />
            <ProfileFields fieldName="Major" fieldDetails={particulars.major} />
            <ProfileFields fieldName="Hobby" fieldDetails={particulars.hobby} />
            <ProfileFields fieldName="CCA" fieldDetails={particulars.cca} />
            <div />
            <div className="flex justify-end">
              <Tooltip label={"Edit Profile"}>
                <div>
                  <FaEdit
                    className="text-xl cursor-pointer"
                    onClick={handleEditProfile}
                  />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
