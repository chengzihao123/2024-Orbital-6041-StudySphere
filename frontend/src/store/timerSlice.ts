import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TimerState {
  isFullscreen: boolean;
  isUserTime: boolean;
  countdownSeconds: number;
  backgroundSettings: {
    backgroundImage: string;
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
    setBackgroundSettings(
      state,
      action: PayloadAction<TimerState["backgroundSettings"]>
    ) {
      state.backgroundSettings = action.payload;
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
  setBackgroundSettings,
  setShowAdditionalSetting,
} = timerSlice.actions;

export default timerSlice.reducer;
