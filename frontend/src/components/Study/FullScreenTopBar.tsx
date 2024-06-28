import * as React from "react";
import Link from "next/link";
import CountdownTimer from "./Timer";
import { Tabs, TabList, Tab, TabIndicator, Box } from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { setIsFullscreen, setIsUserTime } from "@/store/timerSlice";

export const FullScreenTopBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isFullscreen, countdownSeconds, isUserTime } = useSelector(
    (state: RootState) => state.timer
  );

  const handleFullscreenToggle = () => {
    dispatch(setIsFullscreen(!isFullscreen));
  };

  const handleUserTimeToggle = () => {
    dispatch(setIsUserTime(!isUserTime));
  };

  const exitFullscreen = () => {
    handleFullscreenToggle();
    if (isUserTime) {
      handleUserTimeToggle();
    }
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <nav className="bg-gray-400 p-7 relative w-screen rounded-sm">
      <div className="container mx-auto flex justify-center items-center h-16">
        <div className="absolute left-0 top-0 mt-4 ml-4">
          <CountdownTimer
            onTimeUp={exitFullscreen}
            initialTime={countdownSeconds}
          />
        </div>
        <div className="absolute right-5 top-8 mt-4 mr-4">
          <Link
            href={"/study"}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full"
            onClick={exitFullscreen}
          >
            End Study
          </Link>
        </div>
        <Box width="100%" display="flex" justifyContent="center">
          <Tabs position="relative" variant="unstyled">
            <TabList>
              <Link href="/study/background">
                <Tab>None</Tab>
              </Link>
              <Link href="/todos">
                <Tab>Todo</Tab>
              </Link>
              <Link href="/chatrooms">
                <Tab>Community</Tab>
              </Link>
            </TabList>
            <TabIndicator
              mt="-1.5px"
              height="2px"
              bg="blue.500"
              borderRadius="1px"
            />
          </Tabs>
        </Box>
      </div>
    </nav>
  );
};
