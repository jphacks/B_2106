import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Table.scss";
import { DirectionType } from "../../../../_type";
import CenterField from "../CenterField/CenterField";
import DropField from "../DropField/DropField";
import { dahai, selectTableState } from "./TableSlice";

const Table: React.FC = () => {
  const tableState = useSelector(selectTableState);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Table: useEffect");

    dispatch(
      dahai({
        sutehai: getTestData(),
        canRiichi: true,
      })
    );
  }, []);

  const kawaList = [];

  for (let i = 0; i < 4; i++) {
    kawaList.push(
      <DropField
        key={i}
        sutehaiList={tableState.sutehai[i]}
        direction={getDirection(i)}
        haiDirection={getDirection(i, tableState.canRiichi)}
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
    for (let j = 1; j < 8; j++) {
      sutehai[i].push(`${j}m`);
    }
    for (let j = 1; j < 8; j++) {
      sutehai[i].push(`${j}p`);
    }
  }

  return sutehai;
}

function getDirection(
  directionNum: number,
  canRiichi?: boolean
): DirectionType {
  if (canRiichi) {
    directionNum += 1;

    if (directionNum > 3) {
      directionNum -= 4;
    }
  }

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
