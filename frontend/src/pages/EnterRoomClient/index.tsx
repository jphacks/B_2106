import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Alert from "@mui/material/Alert";
import { useHistory, useParams } from "react-router-dom";
import { Box, Modal } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { SocketContext } from "../../App";

type Inputs = { roomID: number; name: string };

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "80%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "20px",
};

const inputIdStyle = {
  position: "absolute" as "absolute",
  top: "30%",
  left: "30%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "20px",
};

const inputNameStyle = {
  position: "absolute" as "absolute",
  top: "30%",
  left: "70%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "20px",
};

const buttonStyle = {
  position: "absolute" as "absolute",
  top: "70%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "20px",
};

const bigText = {
  fontSize: "40px",
};

interface ParamTypes {
  id: string;
}

export const EnterRoomClient: React.FC = () => {
  // socketの呼び出し
  const socket = React.useContext(SocketContext);

  // successとErrorの定義
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined
  );

  //form周り
  const { id } = useParams<ParamTypes>();
  const idInt = Number(id);
  const { register, handleSubmit, watch } = useForm<Inputs>({
    defaultValues: {
      roomID: idInt,
      name: "",
    },
  });
  const { roomID, name } = watch(); // これで監視できる
  useEffect(() => {
    if (idInt) {
      setSuccessMessage("roomIDをQRコードから読み取りました");
    }
  }, []);

  //socket周り
  const [isWaiting, setIsWaiting] = React.useState(false);
  const history = useHistory();

  useEffect(() => {
    socket.on("enter-room-response", (res) => {
      setErrorMessage(undefined);
      setSuccessMessage(undefined);
      console.log("enter-room-response" + res);
      if ("error" in res) {
        setErrorMessage("不正なルームIDです");
        setIsWaiting(false);
      } else {
        setSuccessMessage("ルーム待機中です");
        setIsWaiting(true);
      }
    });
    socket.on("start-game-response", (res) => {
      console.log("start-game-response" + res);
      history.push("/game_client");
    });
  }, []);

  const enterRoom = (data: Inputs) => {
    console.log(data);
    socket.emit("enter-room", { name: data.name, roomID: data.roomID });
  };

  const exitRoom = () => {
    console.log("exitRoom");
    socket.emit("exit-room", { roomID: roomID });
    setIsWaiting(false);
    setSuccessMessage(undefined);
  };

  return (
    <div className="enterRoomClient">
      {errorMessage && <Alert severity="error"> {errorMessage} </Alert>}
      {successMessage && <Alert severity="success"> {successMessage} </Alert>}
      <form onSubmit={handleSubmit(enterRoom)}>
        <Input
          sx={inputIdStyle}
          color="success"
          type="number"
          placeholder="ルームID"
          {...register("roomID", { required: true })}
        />
        <Input
          sx={inputNameStyle}
          color="success"
          placeholder="ユーザー名"
          {...register("name", { required: true })}
        />
        <br />
        <Button
          sx={buttonStyle}
          color="success"
          type="submit"
          variant="contained"
        >
          ルームに入る
        </Button>

        <Modal
          open={isWaiting}
          onClose={exitRoom}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p>対戦が始まるのを待っています</p>
            <br></br>
            <p>
              <span>あなたのルームID: </span>
              <span style={bigText}>{roomID}</span>
            </p>

            <br></br>
            <p>
              <span>あなたのユーザー名:</span>
              <span style={bigText}> {name}</span>
            </p>

            <br></br>
            <Button
              color="success"
              variant="contained"
              disableElevation
              onClick={exitRoom}
              startIcon={<ArrowBackIcon />}
            >
              ルームID入力に戻る
            </Button>
          </Box>
        </Modal>
      </form>
    </div>
  );
};
