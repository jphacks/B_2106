import process from "process";
import io, { Socket } from "socket.io-client";
import { store } from "../store";
im;
// import { dahai } from "../pages/GameHost/_components/Table/TableSlice";

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

  setupGameHost();
}

function setupGameHost() {
  window.socket.on("tablet-kyokustart", () => {});

  window.socket.on("tablet-dahai", (req) => {
    // store.dispatch(
    //   dahai({
    //     playerId: req.playerId,
    //     pai: req.pai,
    //     isRiichi: req.isRiichi,
    //   })
    // );
  });

  window.socket.on("tablet-riichi", () => {});

  window.socket.on("tablet-reset", () => {});
}

function tsumo() {
  window.socket.emit("tablet-tsumo");
}

function riichi() {
  window.socket.emit("tablet-riichi-pushed");
}

export { initSocket, setupGameHost, tsumo, riichi };
