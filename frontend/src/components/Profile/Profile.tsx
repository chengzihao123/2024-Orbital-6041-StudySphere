import { useAuth } from "@/components/Auth/AuthContext";
import HomeAvatar from "@/components/Home/HomeAvatar";
import ProfileFields from "@/components/Profile/ProfileFields";
import { Tooltip, Box, Progress, Flex, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaEdit, FaInfoCircle } from "react-icons/fa";

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

  const dailyXP = 0;
  const dailyXPTarget = 40;
  const totalXP = 0;

  const xpTooltipContent = (
    <Box>
      <Text>Ways to earn XP:</Text>
      <Text>
        • Sign in <span style={{ color: "green" }}>+10XP</span>
      </Text>
      <Text>
        • Spent one hour in study mode{" "}
        <span style={{ color: "green" }}>+10XP</span>
      </Text>
      <Text>
        • Answer one question posted in chat groups{" "}
        <span style={{ color: "green" }}>+10XP</span>
      </Text>
      <Text>
        • Complete one quest posted in chat groups{" "}
        <span style={{ color: "green" }}>+10XP</span>
      </Text>
    </Box>
  );

  return (
    <>
      <div className="flex flex-row justify-center items-center w-screen mb-5">
        <div className="flex flex-col items-center">
          <HomeAvatar classes="mt-2" isHome={false} />
          <div className="mt-4">
            <h1 className="text-xl font-main font-semibold">
              {profile?.displayName ?? ""}
            </h1>
          </div>
        </div>
        <div className="flex flex-col items-center ml-10 w-[350px] ">
          <Box className="py-4 mt-[62px] ml-10">
            <Flex alignItems="center">
              <Progress
                value={(dailyXP / dailyXPTarget) * 100}
                hasStripe
                isAnimated
                width="100px"
                minWidth="100px"
                borderRadius="md"
              />
              <Flex alignItems="center" ml={4}>
                <Text as="b">{`${dailyXP}/${dailyXPTarget} daily XP earned`}</Text>
                <Tooltip label={xpTooltipContent}>
                  <Box ml={2}>
                    <FaInfoCircle className="cursor-pointer mt-[2.5px]" />
                  </Box>
                </Tooltip>
              </Flex>
            </Flex>
          </Box>
          <div>{`Total XP earned: ${totalXP}`}</div>
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
