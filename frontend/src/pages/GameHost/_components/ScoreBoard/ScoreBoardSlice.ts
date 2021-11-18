import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

type NumberList = [number, number, number, number];

interface Result {
  yaku: { [k: string]: string };
  name: string;
  details: string;
  ten: number;
  diff: NumberList;
  score: NumberList;
  dora: string[];
  uradora: string[];
}

interface RyukyokuResult {
  diff: NumberList;
  score: NumberList;
}

interface ScoreBoardState {
  open: boolean;
  isRyukyoku: boolean;
  result: Result;
}

const initialState: ScoreBoardState = {
  open: false,
  isRyukyoku: false,
  result: {
    yaku: {},
    name: "",
    details: "",
    ten: 0,
    diff: [0, 0, 0, 0],
    score: [0, 0, 0, 0],
    dora: [],
    uradora: [],
  },
};

export const scoreBoardSlice = createSlice({
  name: "scoreBoard",
  initialState,
  reducers: {
    openScoreBoard: (state: ScoreBoardState, action: PayloadAction<Result>) => {
      state.result = action.payload;

      state.isRyukyoku = false;
      state.open = true;
    },
    openRyukyokuScoreBoard: (
      state: ScoreBoardState,
      action: PayloadAction<RyukyokuResult>
    ) => {
      state.result.diff = action.payload.diff;
      state.result.score = action.payload.score;

      state.isRyukyoku = true;
      state.open = true;
    },
    closeScoreBoard: (state: ScoreBoardState) => {
      state.open = false;
    },
  },
});

export const { openScoreBoard, openRyukyokuScoreBoard, closeScoreBoard } =
  scoreBoardSlice.actions;

export const selectScoreBoardState = (state: RootState): ScoreBoardState =>
  state.scoreBoard;

export default scoreBoardSlice.reducer;
