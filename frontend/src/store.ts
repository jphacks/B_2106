import { configureStore } from "@reduxjs/toolkit";
import roomHostReducer from "./pages/RoomHost/RoomHostSlice";
import tableReducer from "./pages/GameHost/_components/Table/TableSlice";
import centerFieldReducer from "./pages/GameHost/_components/CenterField/CenterFieldSlice";
import clientFlagReducer from "./pages/GameClient/ClientFlagSlice";
import tehaiReducer from "./pages/GameClient/TehaiSlice";
import scoreBoardReducer from "./pages/GameHost/_components/ScoreBoard/ScoreBoardSlice";
import resultBoardReducer from "./pages/GameHost/_components/ResultBoard/ResultBoardSlice";
import sidebarReducer from "./pages/GameHost/_components/Sidebar/SidebarSlice";

export const store = configureStore({
  reducer: {
    roomHost: roomHostReducer,
    table: tableReducer,
    centerField: centerFieldReducer,
    clientFlag: clientFlagReducer,
    tehai: tehaiReducer,
    scoreBoard: scoreBoardReducer,
    resultBoard: resultBoardReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
