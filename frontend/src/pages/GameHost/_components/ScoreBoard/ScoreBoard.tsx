import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ScoreBoard.scss";
import { selectScoreBoardState, resetScoreBoard } from "./ScoreBoardSlice";
import classNames from "classnames";
import Hougaku from "../../../../_components/Hougaku/Hougaku";
import { getKazeName } from "../CenterField/CenterField";
import { selectCenterFieldState } from "../CenterField/CenterFieldSlice";
import { emitTabletSendOk } from "../../../../services/socket";
import ModalBoard from "../ModalBoard/ModalBoard";
import { selectRoomHostState } from "../../../RoomHost/RoomHostSlice";
import Hai from "../../../../_components/Hai/Hai";

const ScoreBoard: React.FC = () => {
  const RoomHostState = useSelector(selectRoomHostState);
  const scoreBoardState = useSelector(selectScoreBoardState);
  const centerFieldState = useSelector(selectCenterFieldState);

  const dispatch = useDispatch();

  const resultState = scoreBoardState.result;

  const scoreFields: ReactElement[] = [];

  for (let i = 0; i < 4; i++) {
    scoreFields.push(
      <div
        key={i}
        className={classNames(
          "score-board__score-field__scores",
          `score-board__score-field__scores--${i}`
        )}
      >
        <div className="score-board__score-field__scores__playername">
          <Hougaku
            text={getKazeName(i, centerFieldState.oya)}
            direction="down"
            device="host"
          />
          {RoomHostState.playerNames[i]}
        </div>
        <div className="score-board__score-field__scores__score">
          {resultState.score[i]}
        </div>
        <div
          className={classNames(
            "score-board__score-field__scores__diff",
            {
              "score-board__score-field__scores__diff--pos":
                resultState.diff[i] > 0,
            },
            {
              "score-board__score-field__scores__diff--neg":
                resultState.diff[i] < 0,
            }
          )}
        >
          {resultState.diff[i] >= 0 ? "+" : ""}
          {resultState.diff[i]}
        </div>
      </div>
    );
  }

  const title = scoreBoardState.isRyukyoku
    ? "流局"
    : `${resultState.name} ${resultState.details} ${resultState.ten}点`;

  const doraHai = scoreBoardState.result.dora?.map((hai, i) => (
    <Hai key={i} name={hai} direction="up" is3d={false} />
  ));

  const uradoraHai = scoreBoardState.result.uradora?.map((hai, i) => (
    <Hai key={i} name={hai} direction="up" is3d={false} />
  ));

  const doraField = (
    <>
      <div className="score-board__dora-field">
        <div className="score-board__dora-field__text">ドラ</div>
        <div className="score-board__dora-field__hai">{doraHai}</div>
      </div>
      <div className="score-board__dora-field">
        <div className="score-board__dora-field__text">裏ドラ</div>
        <div className="score-board__dora-field__hai">{uradoraHai}</div>
      </div>
    </>
  );

  const contents = (
    <div className="score-board">
      <div className="score-board__title">{title}</div>
      <div className="score-board__yaku">
        {Object.keys(resultState.yaku).map((key, i) => {
          return (
            <div key={i} className="score-board__yaku__item">
              <div className="score-board__yaku__item__key">{key}</div>
              <div className="score-board__yaku__item__value">
                {resultState.yaku[key]}
              </div>
            </div>
          );
        })}
      </div>
      <div className="score-board__score-field">{scoreFields}</div>
      {!scoreBoardState.isRyukyoku ? doraField : ""}
    </div>
  );

  return (
    <ModalBoard
      open={scoreBoardState.open}
      contents={contents}
      onClickOk={() => {
        dispatch(resetScoreBoard());
        emitTabletSendOk();
      }}
    />
  );
};

export default ScoreBoard;
