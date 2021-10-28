import React, { ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { KazeType } from "../../../../_type";
import "./CenterField.scss";
import {
  selectCenterFieldState,
  setCenterFieldState,
} from "./CenterFieldSlice";
import { DirectionType } from "../../../../_type";
import classNames from "classnames";

interface Props {
  styles?: any;
}

const CenterField: React.FC<Props> = (props) => {
  const centerFieldState = useSelector(selectCenterFieldState);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("CenterField: useEffect");
    dispatch(
      setCenterFieldState({
        oya: 0,
        player: [
          { score: 21000 },
          { score: 27000 },
          { score: 16000 },
          { score: 18000 },
        ],
        turnPlayer: 1,
        riichiPlayer: 3,
      })
    );
  }, []);

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
        {getKazeName(i, centerFieldState.oya)}
      </div>
    );
  }

  const centerField = (
    <div className="center-field" style={props.styles}>
      <button className="center-field__tsumo-button">ツモ</button>
      {fields.point}
      {fields.kaze}
    </div>
  );

  return centerField;
};

export default CenterField;

function getKazeName(kazenum: number, oya: number): KazeType {
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
