import { configureStore } from "@reduxjs/toolkit";
import tableReducer from "./pages/GameHost/_components/Table/TableSlice";

export const store = configureStore({
  reducer: {
    table: tableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
