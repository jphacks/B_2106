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
import { setTurn, setFuro } from "../pages/GameClient/ClientFlagSlice";
import {
  tsumo as tsumoAction,
  dahai as dahaiAction,
  tsumogiri,
  haipai,
} from "../pages/GameClient/TehaiSlice";

declare global {
  interface Window {
    socket: Socket;
  }
}

function initSocket() {
  const API_URL = process.env.REACT_APP_API_URL
    ? process.env.REACT_APP_API_URL
    : "http://localhost:8080";
  window.socket = io(API_URL, {
    transports: ["websocket"],
  });
  console.log("initSocket");
  console.log(API_URL);
  console.log(window.socket);
  setupGameHost();
  setupGameClient();
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
    console.log("tablet-riichi",data);
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
  window.socket.emit("tablet-tsumo", { action: "tsumo" });
}

function riichi(playerId: number) {
  console.log(`riichi player: ${playerId}`);
  window.socket.emit("tablet-riichi-pushed", { playerId: playerId });
}

function emitDahai(pai: string) {
  window.socket.emit("dahai", { action: "dahai", pai: pai });
}
function emitTsumogiri() {
  window.socket.emit("dahai", { action: "tsumogiri", pai: "" });
}
function emitRon() {
  window.socket.emit("ron", { action: "ron" });
}
function emitTsumoagari() {
  window.socket.emit("tsumoAgari", { action: "tsumoagari" });
}

function setupGameClient() {
  window.socket.on("client-kyokustart", (req) => {});
  window.socket.on("client-haipai", (req) => {
    store.dispatch(haipai(req.tehai));
  });
  window.socket.on("client-turnstart", (req) => {
    store.dispatch(tsumoAction(req.pai));
    store.dispatch(
      setTurn({
        isMyturn: req.turnplayer,
        canTsumoagari: req.canTsumoagari,
        canDahai: req.canDahai,
      })
    );
  });
  window.socket.on("client-nextaction", (req) => {
    store.dispatch(setFuro({ canRon: req.canRon }));
  });
  window.socket.on("client-end", (req) => {});
}
/*
"client-kyokustart"で{oya:bool}がtrueなら方角(自風)の表示を光らせる
"client-haipai"で{tehai:string[]}の手牌をセット
"client-turnstart"で{turnplayer:bool, canTsumoagari: bool, canRiichi: bool}に従ってそれらのボタン表示したり，切れるようにする．
"client-nextaction"で{canRon:bool}にあわせてボタンを表示
"client-end"で終了
 */

export { initSocket, setupGameHost, tsumo, riichi };
export { emitTsumogiri, emitRon, emitDahai, emitTsumoagari };
