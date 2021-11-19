import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../store";

type stringList = [string, string, string, string];

interface RoomHostState {
  playerNames: stringList;
  roomId: string;
}

const initialState: RoomHostState = {
  playerNames: ["", "", "", ""],
  roomId: "",
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
    setRoomId: (state: RoomHostState, action: PayloadAction<string>) => {
      state.roomId = action.payload;
    },
  },
});

export const { setPlayerNames, setRoomId } = roomHostSlice.actions;

export const selectRoomHostState = (state: RootState): RoomHostState =>
  state.roomHost;

export default roomHostSlice.reducer;
