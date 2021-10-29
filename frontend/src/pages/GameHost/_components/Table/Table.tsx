import React, { ReactElement, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Table.scss";
import { DirectionType } from "../../../../_type";
import CenterField from "../CenterField/CenterField";
import DropField from "../DropField/DropField";
import { dahai, selectTableState } from "./TableSlice";

const Table: React.FC = () => {
  const tableState = useSelector(selectTableState);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   console.log("Table: useEffect");

  //   dispatch(
  //     dahai({
  //       playerId: 0,
  //       pai: "1m",
  //       isRiichi: false,
  //     })
  //   );
  // }, []);

  const kawaList: ReactElement[][] = [[], [], [], []];

  if (tableState.sutehaiList.length > 1) {
    for (let i = 0; i < 4; i++) {
      kawaList[i].push(
        <DropField
          key={i}
          playerId={i}
          sutehaiList={tableState.sutehaiList[i]}
          direction={getKawaDirection(i)}
        />
      );
    }
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
  let sutehai: string[] = [];

  for (let j = 1; j < 8; j++) {
    sutehai.push(`${j}m`);
  }
  for (let j = 1; j < 8; j++) {
    sutehai.push(`${j}p`);
  }

  return sutehai;
}

function getKawaDirection(directionNum: number): DirectionType {
  switch (directionNum) {
    case 0:
      return "up";
    case 1:
      return "left";
    case 2:
      return "down";
    case 3:
      return "right";
    default:
      throw new Error("directionNum is invalid");
  }
}
