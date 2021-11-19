import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./ResultBoard.scss";
import { selectResultBoardState, resetResultBoard } from "./ResultBoardSlice";
import classNames from "classnames";
import ModalBoard from "../ModalBoard/ModalBoard";
import { useHistory } from "react-router-dom";

const ResultBoard: React.FC = () => {
  const resultBoardState = useSelector(selectResultBoardState);
  const dispatch = useDispatch();
  const history = useHistory();

  const rankingFields: ReactElement[] = [];

  for (let i = 0; i < 4; i++) {
    rankingFields.push(
      <div
        key={i}
        className={classNames(
          "result-board__ranking-field__ranking",
          `result-board__ranking-field__ranking--${i}`
        )}
      >
        <div className="result-board__ranking-field__ranking__rank">
          {i + 1}位
        </div>
        <div className="result-board__ranking-field__ranking__username">
          {resultBoardState.ranking[i].name}
        </div>
        <div className="result-board__ranking-field__ranking__score">
          {resultBoardState.ranking[i].score}
        </div>
      </div>
    );
  }

  const contents = (
    <div className="result-board">
      <div className="result-board__title">終局</div>
      <div className="result-board__ranking-field">{rankingFields}</div>
    </div>
  );

  return (
    <ModalBoard
      open={resultBoardState.open}
      contents={contents}
      onClickOk={() => {
        dispatch(resetResultBoard());
        history.push("/"); // 終局画面でOKボタンを押したらトップに戻る
      }}
    />
  );
};

export default ResultBoard;
