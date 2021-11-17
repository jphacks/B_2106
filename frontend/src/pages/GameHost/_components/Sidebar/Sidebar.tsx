import React from "react";
import { useSelector } from "react-redux";
import "./Sidebar.scss";
import { selectSidebarState } from "./SidebarSlice";
import Hai from "../../../../_components/Hai/Hai";

const Sidebar: React.FC = () => {
  const sidebarState = useSelector(selectSidebarState);

  const doraHai = sidebarState.dora.map((hai, i) => (
    <Hai key={i} name={hai} direction="up" is3d={false} />
  ));

  const sidebar = (
    <div className="sidebar">
      <div className="sidebar__title">
        東{sidebarState.kyoku}局{sidebarState.honba}本場
      </div>
      <div className="sidebar__dora">
        <div className="sidebar__dora__text">ドラ</div>
        <div className="sidebar__dora__hai">{doraHai}</div>
      </div>
    </div>
  );

  return sidebar;
};

export default Sidebar;
