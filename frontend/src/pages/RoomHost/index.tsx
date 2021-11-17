import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Card } from "@mui/material";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../App";
import { setPlayerNames } from "./RoomHostSlice";
import { Config } from "../../config";
import { QRCodeImg } from "@cheprasov/react-qrcode";

const buttonStyle = {
  position: "absolute" as "absolute",
  top: "60%",
  left: "75%",
  transform: "translate(-50%, -50%)",
  width: "30%",
  p: 4,
  fontSize: "4vh",
};
const idStyle = {
  position: "absolute" as "absolute",
  top: "40%",
  left: "75%",
  border: "2px solid #000",
  boxShadow: 24,
  transform: "translate(-50%, -50%)",
  width: "30%",
  p: 4,
  fontSize: "3vh",
};
const playersStyle = {
  position: "absolute" as "absolute",
  top: "60%",
  left: "33%",
  border: "2px solid #000",
  boxShadow: 24,
  transform: "translate(-50%, -50%)",
  width: "30%",
  height: 400,
  p: 4,
  fontSize: "3vh",
};
const playerStyle = {
  fontSize: "4vh",
  margin: "26px",
  alignItems: "center",
  justifyContent: "center",
  display: "flex",
};

const qrStyle = { position: "absolute" };

const bigText = { fontSize: "5vh" };

type Props = {
  match: {};
};

export const RoomHost: React.FC<Props> = () => {
  //playersのuseState
  //roomsのuseState

  const dispatch = useDispatch();
  const history = useHistory();
  const socket = React.useContext(SocketContext);

  //起動時に実行される room周りの処理
  //https://github.com/cheprasov/ts-react-qrcode
  type RoomProps = {
    id: string;
  };

  const [roomID, setRoomId] = useState<RoomProps>();
  const [qrCode, setQrCode] = useState<String>();

  useEffect(() => {
    socket.emit("create-room");
    socket.on("create-room-response", (res) => {
      console.log("create-room");
      console.log(res);
      setRoomId(res.roomID);
      setQrCode(
        "<QRCodeImg value=" +
          Config.API_URL +
          ":" +
          Config.API_PORT +
          "enter_room_client/" +
          res.roomID +
          " />"
      );
    });
  }, []);

  //player入退室周りの処理
  type PlayerProps = {
    name: string;
    id: string;
  };
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  useEffect(() => {
    socket.on("enter-room-response", (res: PlayerProps) => {
      console.log("enter-room-response");
      console.log([...players, res]);
      setPlayers([...players, res]);
    });
    // eslint-disable-next-line no-unused-vars
    socket.on("start-game-response", (res) => {
      console.log("start-game-response");
      dispatch(setPlayerNames(res));
      history.push("/game_host");
    });
    socket.on("exit-room-response", (res) => {
      console.log("exit room response");
      setPlayers(
        players.filter((player) => {
          player.id != res.id;
        })
      );
    });
  }, [players]);

  const startGame = () => {
    console.log("startGame");
    socket.emit("start-game", { roomID: roomID });
  };
  console.log(players);
  return (
    <div className="roomHost">
      <Card sx={idStyle}>
        ルームID <span style={bigText}>{roomID}</span>
      </Card>
      <Card sx={playersStyle} className="roomHost__container__players">
        参加者一覧
        {players.map((player, id) => {
          // eslint-disable-next-line react/jsx-key
          return (
            <p style={playerStyle} key={id}>
              {" "}
              {player.name}{" "}
            </p>
          );
        })}
      </Card>
      <Button
        // eslint-disable-next-line no-constant-condition
        sx={buttonStyle}
        color="success"
        disabled={players.length != 4}
        variant="contained"
        disableElevation
        onClick={startGame}
      >
        StartGame
      </Button>
      <QRCodeImg value={"https://localhost:3000/enter_room_client/" + roomID} />
    </div>
  );
};
