import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

interface Result {
  yaku: { [k: string]: string };
  details: string;
  ten: number;
  diff: [number, number, number, number];
  score: [number, number, number, number];
}

interface ScoreBoardState {
  open: boolean;
  result: Result;
}

const initialState: ScoreBoardState = {
  open: false,
  result: {
    yaku: {},
    details: "",
    ten: 0,
    diff: [0, 0, 0, 0],
    score: [0, 0, 0, 0],
  },
};

export const scoreBoardSlice = createSlice({
  name: "scoreBoard",
  initialState,
  reducers: {
    setOpen: (state: ScoreBoardState, action: PayloadAction<boolean>) => {
      state.open = action.payload;
    },
    setResult: (state: ScoreBoardState, action: PayloadAction<Result>) => {
      state.result = action.payload;
    },
  },
});

export const { setOpen, setResult } = scoreBoardSlice.actions;

export const selectScoreBoardState = (state: RootState): ScoreBoardState =>
  state.scoreBoard;

export default scoreBoardSlice.reducer;
