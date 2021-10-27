import React from "react";
import classNames from "classnames";
import "./DropField.scss";
import { DirectionType } from "../../../../_type";
import Hai from "../../../../_components/Hai/Hai";

interface Props {
  sutehaiList: string[];
  direction: DirectionType;
}

const DropField: React.FC<Props> = (props) => {
  let sutehaiList: string[][] = [[], [], [], [], []];

  let listIndex = 0;

  props.sutehaiList.forEach((sutehai, i) => {
    sutehaiList[listIndex].push(sutehai);

    if (i % 6 === 5) {
      listIndex++;
    }
  });

  const dropField = (
    <div className={classNames("drop-field", `drop-field-${props.direction}`)}>
      <div className={`drop-field-${props.direction}__kawa`}>
        {sutehaiList.map((sutehaiLine, i) => {
          return (
            <div
              key={i}
              className={`drop-field-${props.direction}__kawa__sutehai-line`}
            >
              {sutehaiLine.map((sutehai, j) => {
                return (
                  <Hai
                    key={`${i}-${j}`}
                    name={sutehai}
                    direction={props.direction}
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
