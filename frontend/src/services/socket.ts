import process from "process";
import io, { Socket } from "socket.io-client";
import { store } from "../store";
import {
  dahai,
  kyokuStartTable,
} from "../pages/GameHost/_components/Table/TableSlice";
import {
  setRiichiPlayer,
  setupTsumo,
  resetButton,
  kyokuStartCenterField,
} from "../pages/GameHost/_components/CenterField/CenterFieldSlice";

declare global {
  interface Window {
    socket: Socket;
  }
}

function initSocket() {
  const API_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : "https://localhost:8080";
  window.socket = io(API_URL, {
    transports: ["websocket"],
  });
  console.log("initSocket");
  console.log(window.socket);
  setupGameHost();
}

function setupGameHost() {
  window.socket.on("tablet-kyokustart", (data) => {
    store.dispatch(kyokuStartTable(data));
    store.dispatch(kyokuStartCenterField(data));
  });

  window.socket.on("tablet-dahai", (data) => {
    store.dispatch(dahai(data));
  });

  window.socket.on("tablet-riichi", (data) => {
    store.dispatch(setRiichiPlayer(data.playerId));
  });

  window.socket.on("tablet-reset", () => {
    store.dispatch(resetButton());
  });

  window.socket.on("tablet-tsumo", (data) => {
    store.dispatch(setupTsumo(data));
  });
}

function tsumo() {
  console.log("tsumo");
  window.socket.emit("tablet-tsumo");
}

function riichi(playerId: number) {
  console.log(`riichi player: ${playerId}`);
  window.socket.emit("tablet-riichi-pushed", { playerId: playerId });
}

export { initSocket, setupGameHost, tsumo, riichi };
