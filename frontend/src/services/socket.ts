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
  window.socket = io("http://localhost:8080", {
    transports: ["websocket"],
  });

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

function riichi() {
  console.log("riichi");
  window.socket.emit("tablet-riichi-pushed");
}

export { initSocket, setupGameHost, tsumo, riichi };
