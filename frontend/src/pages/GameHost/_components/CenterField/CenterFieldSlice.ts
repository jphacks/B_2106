import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

interface PlayerState {
  score: number;
}

interface CenterFieldState {
  oya: number;
  player: PlayerState[];
  turnPlayer: number;
  riichiPlayer: number;
  shouldDisableTsumo: boolean;
  shouldDisableRiichi: boolean;
}

const initialState: CenterFieldState = {
  oya: 0,
  player: [{ score: 0 }, { score: 0 }, { score: 0 }, { score: 0 }],
  turnPlayer: 0,
  riichiPlayer: 0,
  shouldDisableTsumo: true,
  shouldDisableRiichi: true,
};

export const centerFieldSlice = createSlice({
  name: "centerField",
  initialState,
  reducers: {
    resetCenterField: (state) => {
      return Object.assign({}, state, initialState);
    },
    setRiichiPlayer: (state, action) => {
      state.shouldDisableRiichi = false;
      state.riichiPlayer = action.payload.playerId;
    },
    setupTsumo: (state, action) => {
      state.shouldDisableTsumo = false;
      state.turnPlayer = action.payload.turnPlayer;
    },
    resetButton: (state) => {
      state.shouldDisableTsumo = true;
      state.shouldDisableRiichi = true;
    },
    setupCenterField: (state, action) => {
      state.oya = action.payload.oya;
      state.player = action.payload.player;
      state.turnPlayer = action.payload.oya;
    },
    setScore: (
      state: CenterFieldState,
      action: PayloadAction<{
        playerId: number;
        score: number;
      }>
    ) => {
      let player_copy = [...state.player];

      player_copy[action.payload.playerId].score = action.payload.score;

      state.player = player_copy;
    },
  },
});

export const {
  resetCenterField,
  setRiichiPlayer,
  setupTsumo,
  resetButton,
  setupCenterField,
  setScore,
} = centerFieldSlice.actions;

export const selectCenterFieldState = (state: RootState): CenterFieldState =>
  state.centerField;

export default centerFieldSlice.reducer;
