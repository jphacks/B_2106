import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RootState } from "../../store";
interface ClientFlagState {
  canRon: boolean;
  canTsumoagari: boolean;
  canDahai: boolean;
  canRiichi: boolean;
  canGoTop: boolean;
  isMyturn: boolean;
}
interface Turn {
  canTsumoagari: boolean;
  isMyturn: boolean;
  canDahai: boolean;
  canRiichi: boolean;
}
interface Furo {
  canRon: boolean;
}
interface End {
  canGoTop: boolean;
}

const initialState = {
  canRon: false,
  canTsumoagari: false,
  isMyturn: false,
  canDahai: false,
} as ClientFlagState;

const clientFlagSlice = createSlice({
  name: "clientFlag",
  initialState,
  reducers: {
    setTurn(state, action: PayloadAction<Turn>) {
      return { ...state, ...action.payload };
    },
    setFuro(state, action: PayloadAction<Furo>) {
      return { ...state, ...action.payload };
    },
    setGoTop(state, action: PayloadAction<End>) {
      return { ...state, ...action.payload };
    },
    resetUI(state) {
      return {
        ...state,
        canRiichi: false,
        canRon: false,
        canTsumoAgari: false,
        canDahai: false,
      };
    },
  },
});

export const { setTurn, setFuro, setGoTop, resetUI } = clientFlagSlice.actions;
export default clientFlagSlice.reducer;
export const selectClientFlag = (state: RootState): ClientFlagState =>
  state.clientFlag;
