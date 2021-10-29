import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { KazeType } from "../../../../_type";
import "./CenterField.scss";
import { selectCenterFieldState } from "./CenterFieldSlice";
import { DirectionType } from "../../../../_type";
import classNames from "classnames";
import Hougaku from "../../../../_components/Hougaku/Hougaku";
import { tsumo, riichi } from "../../../../services/socket";

interface Props {
  styles?: any;
}

const CenterField: React.FC<Props> = (props) => {
  const centerFieldState = useSelector(selectCenterFieldState);

  interface Fields {
    score: ReactElement[];
    kaze: ReactElement[];
  }

  const fields: Fields = {
    score: [],
    kaze: [],
  };
  console.log(
    "compoonet",
    centerFieldState.shouldDisableRiichi,
    centerFieldState.riichiPlayer
  );

  for (let i = 0; i < 4; i++) {
    let direction: DirectionType = "up";
    let hougakuDirection: DirectionType = "down";

    if (i == 1) {
      direction = "left";
      hougakuDirection = "right";
    } else if (i == 2) {
      direction = "down";
      hougakuDirection = "up";
    } else if (i == 3) {
      direction = "right";
      hougakuDirection = "left";
    }

    fields.score.push(
      <button
        key={i}
        onClick={() => {
          try {
            riichi(i);
          } catch (error) {
            console.error(error);
          }
        }}
        className={classNames(
          "center-field__contents__score",
          `center-field__contents__score--${direction}`
        )}
        disabled={
          /*
          centerFieldState.shouldDisableRiichi ||
          centerFieldState.riichiPlayer !== i*/
          false
        }
      >
        <span>{centerFieldState.player[i].score}</span>
      </button>
    );

    fields.kaze.push(
      <div
        key={i}
        className={classNames(
          "center-field__contents__kaze",
          `center-field__contents__kaze--${direction}`
        )}
      >
        <Hougaku
          text={getKazeName(i, centerFieldState.oya)}
          isLighting={i == centerFieldState.turnPlayer}
          direction={hougakuDirection}
          device="host"
        />
      </div>
    );
  }

  const centerField = (
    <div className="center-field" style={props.styles}>
      <div className="center-field__contens">
        <button
          onClick={() => {
            try {
              tsumo();
            } catch (error) {
              console.error(error);
            }
          }}
          className="center-field__contents__tsumo-button"
          disabled={centerFieldState.shouldDisableTsumo}
        >
          ツモ
        </button>
        {fields.score}
        {fields.kaze}
      </div>
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
