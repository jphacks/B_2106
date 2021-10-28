import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./pages/GameHost/_components/Table/TableSlice";
import centerFieldReducer from "./pages/GameHost/_components/CenterField/CenterFieldSlice";

export const store = configureStore({
  reducer: {
    table: tableReducer,
    centerField: centerFieldReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
