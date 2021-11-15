import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

interface Ranking {
  name: string;
  score: number;
}

interface ResultBoardState {
  open: boolean;
  ranking: [Ranking, Ranking, Ranking, Ranking];
}

const initialRanking: Ranking = {
  name: "",
  score: 0,
};

const initialState: ResultBoardState = {
  open: false,
  ranking: [initialRanking, initialRanking, initialRanking, initialRanking],
};

export const resultBoardSlice = createSlice({
  name: "resultBoard",
  initialState,
  reducers: {
    openResultBoard: (state: ResultBoardState, action: PayloadAction<{ranking:[Ranking, Ranking, Ranking, Ranking]}>) => {
      console.log(action.payload)
      state.ranking = action.payload.ranking;
      state.open = true;
    },
    closeResultBoard: (state: ResultBoardState) => {
      state.open = false;
    },
  },
});

export const { openResultBoard, closeResultBoard } = resultBoardSlice.actions;

export const selectResultBoardState = (state: RootState): ResultBoardState =>
  state.resultBoard;

export default resultBoardSlice.reducer;
