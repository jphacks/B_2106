import io, { Socket } from "socket.io-client";
import { store } from "../store";
// import { dahai } from "../pages/GameHost/_components/Table/TableSlice";
import { dahai } from "../pages/GameHost/_components/Table/TableSlice";
import { setTurn, setFuro }  from "../pages/GameClient/ClientFlagSlice";
import { tsumo as tsumoAction, dahai as dahaiAction, tsumogiri,haipai }  from "../pages/GameClient/TehaiSlice";

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



function setupGameClient() {
 // window.socket.on("client-kyokustart", (req) => {});

}
/*
"client-kyokustart"で{oya:bool}がtrueなら方角(自風)の表示を光らせる
"client-haipai"で{tehai:string[]}の手牌をセット
"client-turnstart"で{turnplayer:bool, canTsumoagari: bool, canRiichi: bool}に従ってそれらのボタン表示したり，切れるようにする．
"client-nextaction"で{canRon:bool}にあわせてボタンを表示
"client-end"で終了
 */


export { initSocket, setupGameHost, tsumo, riichi };
