import React, { useState, useEffect, ReactElement } from "react";
import { useDispatch } from "react-redux";
import { Config } from "../../config";
import "./RoomHost.scss";
import classNames from "classnames";
import { Button, Card } from "@mui/material";
import { useHistory } from "react-router-dom";
import { SocketContext } from "../../App";
import { setPlayerNames } from "./RoomHostSlice";
import { KazeType } from "../../_type";
import Hougaku from "../../_components/Hougaku/Hougaku";

import { QRCodeImg } from "@cheprasov/react-qrcode";

const buttonStyle = {
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  fontSize: "4vh",
};

const idStyle = {
  position: "absolute" as "absolute",
  top: "3%",
  left: "3%",
  boxShadow: 24,
  width: "25%",
  p: 3,
  fontSize: "3vh",
};

const playersStyle = {
  border: "2px solid #000",
  fontSize: "3vh",
};

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

  const [roomID, setRoomId] = useState<string>();
  const [qrCode, setQrCode] = useState<ReactElement>();

  useEffect(() => {
    socket.emit("create-room");
    socket.on("create-room-response", (res) => {
      console.log("create-room");
      console.log(res);
      console.log(
        "QR code URL:",
        `${Config.API_URL}:${Config.API_PORT}/enter_room_client/` + res.roomID
      );
      setRoomId(res.roomID);
      setQrCode(
        <QRCodeImg
          value={
            `${Config.API_URL}:${Config.API_PORT}/enter_room_client/` +
            res.roomID
          }
        />
      );
    });

    return () => {
      socket.off("create-room-response");
    };
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
      setPlayers(players.filter((player) => player.id != res.id));
    });

    return () => {
      socket.off("enter-room-response");
      socket.off("start-game-response");
      socket.off("exit-room-response");
    };
  }, [players]);

  const startGame = () => {
    console.log("startGame");
    socket.emit("start-game", { roomID: roomID });
  };
  console.log(players);

  const playerElements: ReactElement[] = [];

  for (let i = 0; i < 4; i++) {
    playerElements.push(
      <div
        key={i}
        className={classNames(
          "roomHost__container__players",
          `roomHost__container__players--${i}`
        )}
      >
        <Hougaku text={getKazeName(i, 0)} direction="down" device="host" />
        <Card
          sx={{ ...playersStyle, boxShadow: players[i] ? 24 : 0 }}
          className="roomHost__container__players__name"
        >
          {players[i]?.name}
        </Card>
      </div>
    );
  }

  return (
    <div className="roomHost">
      <Card sx={idStyle} className="roomHost__id">
        ルームID <span style={bigText}>{roomID}</span>
      </Card>
      <div className="roomHost__container">
        {playerElements}
        {players.length < 4 ? (
          <div className="roomHost__container__qrcode">{qrCode}</div>
        ) : (
          <Button
            // eslint-disable-next-line no-constant-condition
            className="roomHost__container__button"
            sx={buttonStyle}
            color="success"
            variant="contained"
            disableElevation
            onClick={startGame}
          >
            Start Game
          </Button>
        )}
      </div>
    </div>
  );
};

function getKazeName(kazenum: number, oya: number): KazeType {
  const kaze = ["東", "南", "西", "北"];

  return kaze[(kazenum - oya + 4) % 4] as KazeType;
}
