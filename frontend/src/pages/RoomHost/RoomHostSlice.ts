import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

type stringList = [string, string, string, string];

interface RoomHostState {
  playerNames: stringList;
}

const initialState: RoomHostState = {
  playerNames: ["", "", "", ""],
};

export const roomHostSlice = createSlice({
  name: "roomHost",
  initialState,
  reducers: {
    setPlayerNames: (
      state: RoomHostState,
      action: PayloadAction<{
        players: stringList;
      }>
    ) => {
      state.playerNames = action.payload.players;
    },
  },
});

export const { setPlayerNames } = roomHostSlice.actions;

export const selectRoomHostState = (state: RootState): RoomHostState =>
  state.roomHost;

export default roomHostSlice.reducer;
