import React from "react";
import { useSelector } from "react-redux";
import "./Sidebar.scss";
import { selectRoomHostState } from "../../../RoomHost/RoomHostSlice";
import { selectSidebarState } from "./SidebarSlice";
import Hai from "../../../../_components/Hai/Hai";

const Sidebar: React.FC = () => {
  const roomHostState = useSelector(selectRoomHostState);
  const sidebarState = useSelector(selectSidebarState);

  const doraHai = sidebarState.dora.map((hai, i) => (
    <Hai key={i} name={hai} direction="up" is3d={false} />
  ));

  const sidebar = (
    <div className="sidebar">
      <img src="./logo512.png" className="sidebar__logo" />
      <div className="sidebar__title">
        東{sidebarState.kyoku}局{sidebarState.honba}本場
      </div>
      <div className="sidebar__yama">
        <div className="sidebar__yama__text">山</div>
        <div className="sidebar__yama__num">残り{sidebarState.yamaNum}枚</div>
      </div>
      <div className="sidebar__dora">
        <div className="sidebar__dora__text">ドラ</div>
        <div className="sidebar__dora__hai">{doraHai}</div>
      </div>
      <div className="sidebar__roomId">
        ルームID
        <span className="sidebar__roomId__value">{roomHostState.roomId}</span>
      </div>
    </div>
  );

  return sidebar;
};

export default Sidebar;
