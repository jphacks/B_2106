import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Table.scss";
import { DirectionType } from "../../../../_type";
import CenterField from "../CenterField/CenterField";
import DropField from "../DropField/DropField";
import { dahai } from "./TableSlice";
import { selectTableState } from "./TableSlice";

const Table: React.FC = () => {
  const dispatch = useDispatch();
  const tableState = useSelector(selectTableState);

  // テスト用
  // TODO: socket.jsにsocketの受信イベントハンドラを作成して、そこの中に移動）
  useEffect(() => {
    dispatch(dahai(getTestData()));
  }, []);

  const kawaList = [];
  let direction: DirectionType = "up";

  for (let i = 0; i < 4; i++) {
    if (i == 1) direction = "left";
    else if (i == 2) direction = "down";
    else if (i == 3) direction = "right";

    kawaList.push(
      <DropField
        key={i}
        sutehaiList={tableState.sutehai[0]}
        direction={direction}
      />
    );
  }

  const table = (
    <div className="table">
      <CenterField />
      {kawaList}
    </div>
  );

  return table;
};

export default Table;

function getTestData() {
  let sutehai: string[][] = [[], [], [], []];

  for (let i = 0; i < 4; i++) {
    for (let j = 1; j < 10; j++) {
      sutehai[i].push(`${j}m`);
    }
    for (let j = 1; j < 10; j++) {
      sutehai[i].push(`${j}p`);
    }
  }

  return sutehai;
}
