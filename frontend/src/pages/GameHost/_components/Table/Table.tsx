import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import "./Table.scss";
import { DirectionType } from "../../../../_type";
import CenterField from "../CenterField/CenterField";
import DropField from "../DropField/DropField";
import ScoreBoard from "../ScoreBoard/ScoreBoard";
import { selectTableState } from "./TableSlice";
import ResultBoard from "../ResultBoard/ResultBoard";

const Table: React.FC = () => {
  const tableState = useSelector(selectTableState);

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
      <ScoreBoard />
      <ResultBoard />
    </div>
  );

  return table;
};

export default Table;

function getKawaDirection(directionNum: number): DirectionType {
  const direction = ["up", "left", "down", "right"];

  return direction[directionNum] as DirectionType;
}
