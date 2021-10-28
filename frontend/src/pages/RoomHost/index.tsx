import React, { useState, useEffect } from "react";
import { Header } from "../../_components/Header";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import io, { Socket } from "socket.io-client";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";

type Props = {};
type PlayerProps = {
  name: string;
  id: string;
};
type RoomProps = {
  id: string;
};

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export const RoomHost: React.FC<Props> = () => {
  const [players, setPlayers] = useState<PlayerProps[]>([]);
  const [roomID, setRoomId] = useState<RoomProps>();

  const history = useHistory();

  useEffect(() => {
    socket = io("http://localhost:8080", {
      transports: ["websocket"],
    });

    socket.emit("create-room");

    socket.on("create-room-response", (res) => {
      console.log("create-room");
      console.log(res);
      setRoomId(res.roomID);
    });
  }, []);
  useEffect(() => {
    socket.on("enter-room-response", (res: PlayerProps) => {
      console.log("enter-room-response");
      console.log(res);
      console.log([...players, res]);
      setPlayers([...players, res]);
      console.log(players);
      console.log(roomID);
      console.log(setPlayers);
    });
    // eslint-disable-next-line no-unused-vars
    socket.on("start-game-response", (res) => {
      console.log("start-game-response");
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
  }, [roomID, players]);

  const startGame = () => {
    console.log("startGame");
    socket.emit("start-game", { roomID: roomID });
  };
  console.log(players);
  return (
    <div className="roomHost">
      <div className="roomHost__header">
        <Header text="Room Host" />
      </div>
      <div className="roomHost__container">
        <div className="roomHost__container__id">Room ID:{roomID}</div>
        <p>プレイヤー一覧</p>
        <div className="roomHost__container__players">
          {players.map((player, id) => {
            // eslint-disable-next-line react/jsx-key
            return <p key={id}> {player.name} </p>;
          })}
        </div>
      </div>
      <Button
        // eslint-disable-next-line no-constant-condition
        disabled={players.length != 4}
        variant="contained"
        disableElevation
        onClick={startGame}
      >
        StartGame
      </Button>
    </div>
  );
};
