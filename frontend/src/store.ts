import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./pages/GameHost/_components/Table/TableSlice";
import centerFieldReducer from "./pages/GameHost/_components/CenterField/CenterFieldSlice";
import clientFlagReducer from "./pages/GameClient/ClientFlagSlice"
import tehaiReducer from "./pages/GameClient/TehaiSlice"
export const store = configureStore({
  reducer: {
    table: tableReducer,
    centerField: centerFieldReducer,
    clientFlag:clientFlagReducer,
    tehai:tehaiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
