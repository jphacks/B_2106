import React, { ReactElement } from "react";
import "./ModalBoard.scss";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

interface Props {
  open: boolean;
  contents: ReactElement;
  onClickOk: () => void;
}

const ModalBoard: React.FC<Props> = (props) => {
  return (
    <Modal open={props.open} disableAutoFocus={true}>
      <div className="modal-board">
        <div className="modal-board__contents">{props.contents}</div>
        <Grid
          container
          direction="column"
          height="10vh"
          alignItems="center"
          justifyContent="center"
        >
          <Button
            onClick={props.onClickOk}
            variant="outlined"
            className="modal-board__button"
            sx={{ fontSize: "2.5vh" }}
          >
            OK
          </Button>
        </Grid>
      </div>
    </Modal>
  );
};

export default ModalBoard;
