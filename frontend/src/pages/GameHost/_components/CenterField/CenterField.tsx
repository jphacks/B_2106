import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { KazeType } from "../../../../_type";
import "./CenterField.scss";
import { selectCenterFieldState } from "./CenterFieldSlice";
import { DirectionType } from "../../../../_type";
import classNames from "classnames";

interface Props {
  styles?: any;
}

const CenterField: React.FC<Props> = (props) => {
  const centerFieldState = useSelector(selectCenterFieldState);

  interface Fields {
    point: ReactElement[];
    kaze: ReactElement[];
  }

  const fields: Fields = {
    point: [],
    kaze: [],
  };

  for (let i = 0; i < 4; i++) {
    let direction: DirectionType = "up";

    if (i == 1) direction = "left";
    else if (i == 2) direction = "down";
    else if (i == 3) direction = "right";

    fields.point.push(
      <div
        key={i}
        className={classNames(
          "center-field__point",
          `center-field__point--${direction}`
        )}
      >
        {centerFieldState.player[i].score}
      </div>
    );

    fields.kaze.push(
      <div
        key={i}
        className={classNames(
          "center-field__kaze",
          `center-field__kaze--${direction}`
        )}
      >
        {getKazeName(i)}
      </div>
    );
  }

  const centerField = (
    <div className="center-field" style={props.styles}>
      <div className="center-field__tsumo-button" />
      {fields.point}
      {fields.kaze}
    </div>
  );

  return centerField;
};

export default CenterField;

function getKazeName(kazenum: number): KazeType {
  const oya = useSelector(selectCenterFieldState).oya;

  if (kazenum - oya < 0) {
    kazenum += 4;
  }

  switch (kazenum - oya) {
    case 0:
      return "東";
    case 1:
      return "南";
    case 2:
      return "西";
    case 3:
      return "北";
    default:
      throw new Error("invalid kaze number");
  }
}
