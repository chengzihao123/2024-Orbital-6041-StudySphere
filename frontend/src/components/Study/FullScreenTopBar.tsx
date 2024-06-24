"use client";
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
  // const [value, setValue] = React.useState("one");

  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setValue(newValue);
  // };

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
        {/* <Box sx={{ width: "50%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
            centered
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: "space-between",
              },
              "& .MuiTab-root": {
                minWidth: "100px",
                flex: 1,
                fontWeight: "bold",
                fontSize: "20px",
                textTransform: "none", // Prevents all-caps
              },
              "& .Mui-selected": {
                color: "primary.main", // Custom color for selected tab
              },
              "& .MuiTabs-indicator": {
                height: 3, // Custom indicator thickness
              },
            }}
          >
            <Tab
              value="one"
              label="None"
              component={Link}
              href="/background"
              onClick={() => setValue("one")}
            />
            <Tab
              value="two"
              label="Todo"
              component={Link}
              href="/todos"
              onClick={() => setValue("two")}
            />
            <Tab
              value="three"
              label="Community"
              component={Link}
              href="/chatroom"
              onClick={() => setValue("three")}
            />
          </Tabs>
        </Box> */}
        <Box width="100%" display="flex" justifyContent="center">
          <Tabs position="relative" variant="unstyled">
            <TabList>
              <Link href="/background">
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
