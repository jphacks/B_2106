import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

interface SidebarState {
  kyoku: number;
  honba: number;
  dora: string[];
}

const initialState: SidebarState = {
  kyoku: 0,
  honba: 0,
  dora: [],
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarState: (
      state: SidebarState,
      action: PayloadAction<SidebarState>
    ) => {
      return Object.assign({}, state, action.payload);
    },
  },
});

export const { setSidebarState } = sidebarSlice.actions;

export const selectSidebarState = (state: RootState): SidebarState =>
  state.sidebar;

export default sidebarSlice.reducer;
