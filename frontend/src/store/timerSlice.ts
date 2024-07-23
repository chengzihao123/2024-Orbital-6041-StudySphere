import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type BackgroundImageType =
  | "autumn"
  | "grass"
  | "sea"
  | "mountain"
  | "moon"
  | "";

export interface TimerState {
  isFullscreen: boolean;
  isUserTime: boolean;
  pomodoroCycleLeft: number;
  pomodoroCycleCompleted: number;
  countdownSeconds: number;
  studyTime: number;
  backgroundSettings: {
    backgroundImage: BackgroundImageType;
  };
  showAdditionalSetting: boolean;
}

const initialTimerState: TimerState = {
  isFullscreen: false,
  isUserTime: false,
  pomodoroCycleLeft: 0,
  pomodoroCycleCompleted: 0,
  countdownSeconds: 0,
  backgroundSettings: {
    backgroundImage: "",
  },
  showAdditionalSetting: false,
  studyTime: 0,
};

export const timerSlice = createSlice({
  name: "timer",
  initialState: initialTimerState,
  reducers: {
    setIsFullscreen(state, action: PayloadAction<boolean>) {
      state.isFullscreen = action.payload;
    },
    setIsUserTime(state, action: PayloadAction<boolean>) {
      state.isUserTime = action.payload;
    },
    setpomodoroCycleLeft(state, action: PayloadAction<number>) {
      state.pomodoroCycleLeft = action.payload;
    },
    setpomodoroCycleCompleted(state, action: PayloadAction<number>) {
      state.pomodoroCycleCompleted = action.payload;
    },
    setCountdownSeconds(state, action: PayloadAction<number>) {
      state.countdownSeconds = action.payload;
    },
    setStudyTime(state, action: PayloadAction<number>) {
      state.studyTime = action.payload;
    },
    setBackgroundImage(state, action: PayloadAction<BackgroundImageType>) {
      state.backgroundSettings.backgroundImage = action.payload;
    },
    setShowAdditionalSetting(state, action: PayloadAction<boolean>) {
      state.showAdditionalSetting = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setIsFullscreen,
  setIsUserTime,
  setpomodoroCycleLeft,
  setpomodoroCycleCompleted,
  setCountdownSeconds,
  setBackgroundImage,
  setShowAdditionalSetting,
  setStudyTime,
} = timerSlice.actions;

export default timerSlice.reducer;
