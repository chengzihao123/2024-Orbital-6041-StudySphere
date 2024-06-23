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
  countdownSeconds: number;
  backgroundSettings: {
    backgroundImage: BackgroundImageType;
    backgroundMusic: string;
  };
  showAdditionalSetting: boolean;
}

const initialTimerState: TimerState = {
  isFullscreen: false,
  isUserTime: false,
  countdownSeconds: 0,
  backgroundSettings: {
    backgroundImage: "",
    backgroundMusic: "",
  },
  showAdditionalSetting: false,
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
    setCountdownSeconds(state, action: PayloadAction<number>) {
      state.countdownSeconds = action.payload;
    },
    setBackgroundImage(state, action: PayloadAction<BackgroundImageType>) {
      state.backgroundSettings.backgroundImage = action.payload;
    },
    setBackgroundMusic(state, action: PayloadAction<string>) {
      state.backgroundSettings.backgroundMusic = action.payload;
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
  setCountdownSeconds,
  setBackgroundImage,
  setShowAdditionalSetting,
  setBackgroundMusic,
} = timerSlice.actions;

export default timerSlice.reducer;
