"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Progress, Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import { FaInfoCircle } from "react-icons/fa";

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth() || {};
  const router = useRouter();
  const { todayXP, totalXP } = useSelector(
    (state: RootState) => state.userInfo
  );

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        router.push("/");
      }
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  // Sample XP values
  const dailyXPTarget = 40;

  const xpTooltipContent = (
    <Box>
      <Text>Ways to earn XP:</Text>
      <Text>
        • Sign in <span style={{ color: "green" }}>+10XP</span>
      </Text>
      <Text>
        • Spent one hour in study mode or 2 cycles of Pomodoro{" "}
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
    <nav className="bg-gray-800 p-4 w-full">
      <div className="container mx-auto flex justify-between items-center w-full">
        <div className="flex items-center space-x-4">
          <Link href="/home" className="text-gray-300 hover:text-white">
            <img
              src="/images/logo-horizontal-white.png"
              alt="Study Sphere"
              className="h-8"
            />
          </Link>
          {currentUser && (
            <Box>
              <Flex alignItems="center">
                <Progress
                  value={(totalXP / dailyXPTarget) * 100}
                  hasStripe
                  isAnimated
                  width={["50px", "50px", "100px"]}
                  borderRadius="md"
                />
                <Flex alignItems="center" ml={2}>
                  <Text
                    fontFamily="Roboto"
                    className="sm:text-xs"
                    color={"white"}
                  >{`${totalXP}/${dailyXPTarget} daily XP earned`}</Text>
                  <Tooltip label={xpTooltipContent}>
                    <Box ml={2}>
                      <FaInfoCircle className="cursor-pointer" color="white" />
                    </Box>
                  </Tooltip>
                </Flex>
              </Flex>
            </Box>
          )}
        </div>

        <div className="space-x-4">
          {currentUser ? (
            <>
              <Link href="/todos" className="text-gray-300 hover:text-white">
                Todos
              </Link>
              <Link href="/study" className="text-gray-300 hover:text-white">
                Study
              </Link>
              <Link
                href="/chatrooms"
                className="text-gray-300 hover:text-white"
              >
                Community
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="text-gray-300 hover:text-white">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
