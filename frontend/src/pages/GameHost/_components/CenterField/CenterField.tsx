import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import { KazeType } from "../../../../_type";
import "./CenterField.scss";
import { selectCenterFieldState } from "./CenterFieldSlice";
import { selectTableState } from "../Table/TableSlice";
import { selectRoomHostState } from "../../../RoomHost/RoomHostSlice";
import { DirectionType } from "../../../../_type";
import classNames from "classnames";
import Hougaku from "../../../../_components/Hougaku/Hougaku";
import { tsumo, riichi } from "../../../../services/socket";
import Tenbou from "../../../../_components/Tenbou/Tenbou";

interface Props {
  styles?: any;
}

const CenterField: React.FC<Props> = (props) => {
  const centerFieldState = useSelector(selectCenterFieldState);
  const tableState = useSelector(selectTableState);
  const roomHostState = useSelector(selectRoomHostState);

  interface Fields {
    score: ReactElement[];
    kaze: ReactElement[];
  }

  const fields: Fields = {
    score: [],
    kaze: [],
  };

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

    let isRiichi: boolean = false;

    tableState.sutehaiList[i].forEach((sutehai) => {
      if (sutehai.isRiichi) {
        isRiichi = true;
      }
    });

    fields.score.push(
      <div key={i}>
        <div
          className={classNames(
            "center-field__contents__playernames",
            `center-field__contents__playernames--${direction}`
          )}
        >
          {roomHostState.playerNames[i]}
        </div>
        <button
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
            centerFieldState.shouldDisableRiichi ||
            centerFieldState.riichiPlayer !== i
          }
        >
          <span>{centerFieldState.player[i].score}</span>
        </button>
        {isRiichi && (
          <div
            className={classNames(
              "center-field__contents__tenbou",
              `center-field__contents__tenbou--${getTenbouDirection(i)}`
            )}
          >
            <Tenbou value={1000} direction={getTenbouDirection(i)} />
          </div>
        )}
      </div>
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
      <div className="center-field__contents">
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

export function getKazeName(kazenum: number, oya: number): KazeType {
  const kaze = ["東", "南", "西", "北"];

  return kaze[(kazenum - oya + 4) % 4] as KazeType;
}

function getTenbouDirection(directionNum: number): DirectionType {
  const direction = ["up", "left", "down", "right"];

  return direction[directionNum] as DirectionType;
}
