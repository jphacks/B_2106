import React from "react";
import classNames from "classnames";
import "./DropField.scss";
import { DirectionType } from "../../../../_type";
import Hai from "../../../../_components/Hai/Hai";
import { Sutehai } from "../Table/TableSlice";

interface Props {
  playerId: number;
  sutehaiList: {
    pai: string;
    isRiichi: boolean;
  }[];
  direction: DirectionType;
}

const DropField: React.FC<Props> = (props) => {
  let sutehaiList: Sutehai[][] = [[], [], [], [], []];

  let lineIndex = 0;

  props.sutehaiList.forEach((haiObj, i) => {
    if (!sutehaiList[lineIndex]) {
      sutehaiList.push([]);
    }

    sutehaiList[lineIndex].push(haiObj);

    if (i % 6 === 5) {
      lineIndex++;
    }
  });

  const dropField = (
    <div className={classNames("drop-field", `drop-field--${props.direction}`)}>
      <div className={`drop-field--${props.direction}__kawa`}>
        {sutehaiList.map((sutehaiLine, i) => {
          return (
            <div
              key={i}
              className={`drop-field--${props.direction}__kawa__sutehai-line`}
            >
              {sutehaiLine.map((sutehai, j) => {
                return (
                  <Hai
                    key={`${i}-${j}`}
                    name={sutehai.pai}
                    direction={getHaiDirection(
                      props.playerId,
                      sutehai.isRiichi
                    )}
                    is3d={false}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );

  return dropField;
};

export default DropField;

function getHaiDirection(
  directionNum: number,
  isRiichi: boolean
): DirectionType {
  if (isRiichi) {
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
