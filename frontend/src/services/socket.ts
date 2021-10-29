import io, { Socket } from "socket.io-client";
import { store } from "../store";
// import { dahai } from "../pages/GameHost/_components/Table/TableSlice";

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
