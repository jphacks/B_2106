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
  setupGameClient();
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

function emitDahai(pai:string){
  window.socket.emit("dahai",{action:"dahai",pai});
}
function emitTsumogiri(){
  window.socket.emit("dahai",{action:"tsumogiri",pai:""});
}
function emitRon(){
  window.socket.emit("ron",{action:"ron"});
}
function emitTsumoagari(){
  window.socket.emit("tsumoAgari",{action:"tsumoagari"});
}

function setupGameClient() {
  window.socket.on("client-kyokustart", (req) => {});
  window.socket.on("client-haipai", (req) => {store.dispatch(haipai(req.tehai))});
  window.socket.on("client-turnstart", (req) => {
  store.dispatch(tsumoAction(req.pai));
    store.dispatch(setTurn({isMyturn:req.turnplayer,canTsumoagari:req.canTsumoagari,canDahai:req.canDahai}));
    });
  window.socket.on("client-nextaction", (req) => {store.dispatch(setFuro({canRon:req.canRon}))});
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
