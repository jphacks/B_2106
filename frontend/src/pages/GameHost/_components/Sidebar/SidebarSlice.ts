import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../../../store";

interface SidebarState {
  kyoku: number;
  honba: number;
  dora: string[];
  yamaNum: number;
}

const initialState: SidebarState = {
  kyoku: 0,
  honba: 0,
  dora: [],
  yamaNum: 0,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarState: (
      state: SidebarState,
      action: PayloadAction<{ kyoku: number; honba: number; dora: string[] }>
    ) => {
      state.kyoku = action.payload.kyoku;
      state.honba = action.payload.honba;
      state.dora = action.payload.dora;
    },
    setYamaNum: (
      state: SidebarState,
      action: PayloadAction<{ length: number }>
    ) => {
      state.yamaNum = action.payload.length;
    },
  },
});

export const { setSidebarState, setYamaNum } = sidebarSlice.actions;

export const selectSidebarState = (state: RootState): SidebarState =>
  state.sidebar;

export default sidebarSlice.reducer;
