import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Header } from "../../_components/Header";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import Alert from "@mui/material/Alert";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useHistory } from "react-router-dom";
import { Box, Modal } from "@mui/material";

type Props = {};
type Inputs = { roomID: number; name: string };

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export const EnterRoomClient: React.FC<Props> = () => {
  //react hook form
  const { register, handleSubmit, watch } = useForm<Inputs>({});
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [successMessage, setSuccessMessage] = useState<string | undefined>(
    undefined
  );
  const [isWaiting, setIsWaiting] = React.useState(false);

  const { roomID, name } = watch(); // これで監視できる

  const history = useHistory();

  useEffect(() => {
    socket = io("http://localhost:8080", {
      transports: ["websocket"],
    });
    console.log("connect");

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

    register("name");
    register("roomID");
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
      <Header text="EnterRoomClient" />
      {errorMessage && <Alert severity="error"> {errorMessage} </Alert>}

      {successMessage && <Alert severity="success"> {successMessage} </Alert>}
      <form onSubmit={handleSubmit(enterRoom)}>
        <p>ルームIDを入力してください</p>
        <Input type="number" {...register("roomID", { required: true })} />
        <p>名前を入力してね</p>
        <Input {...register("name", { required: true })} />
        <br />
        <Button type="submit" variant="contained">
          Submit
        </Button>

        <Modal
          open={isWaiting}
          onClose={exitRoom}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <p>対戦が始まるのを待っています</p>
            <p>あなたのルームID: {roomID}</p>
            <p>あなたのユーザー名: {name}</p>
            <Button variant="contained" disableElevation onClick={exitRoom}>
              ルームID入力に戻る
            </Button>
          </Box>
        </Modal>
      </form>
    </div>
  );
};
