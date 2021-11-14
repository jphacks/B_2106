import React, { ReactElement } from "react";
import { useSelector } from "react-redux";
import "./ScoreBoard.scss";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import { selectScoreBoardState, setOpen } from "./ScoreBoardSlice";
import classNames from "classnames";
import Hougaku from "../../../../_components/Hougaku/Hougaku";
import { getKazeName } from "../CenterField/CenterField";
import { selectCenterFieldState } from "../CenterField/CenterFieldSlice";
import Grid from "@mui/material/Grid";
import { emitTabletSendOk } from "../../../../services/socket";

const ScoreBoard: React.FC = () => {
  const scoreBoardState = useSelector(selectScoreBoardState);
  const centerFieldState = useSelector(selectCenterFieldState);

  const resultState = scoreBoardState.result;

  const handleClose = () => setOpen(false);

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
        <div className="score-board__score-field__scores__username">
          <Hougaku
            text={getKazeName(i, centerFieldState.oya)}
            direction="down"
            device="host"
          />
          player.name
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

  return (
    <Modal open={scoreBoardState.open} onClose={handleClose}>
      <>
        <Box className="score-board">
          <div className="score-board__ten">
            {resultState.details}
            {resultState.ten}点
          </div>
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
          <Grid container direction="column" alignItems="center">
            <Button
              onClick={() => emitTabletSendOk()}
              variant="outlined"
              className="score-board__button"
            >
              OK
            </Button>
          </Grid>
        </Box>
      </>
    </Modal>
  );
};

export default ScoreBoard;
