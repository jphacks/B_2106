import process from "process";
import io, { Socket } from "socket.io-client";
import { store } from "../store";
import { Config } from "../config";
import {
  setSidebarState,
  setYamaNum,
} from "../pages/GameHost/_components/Sidebar/SidebarSlice";
import {
  dahai,
  resetSutehaiList,
} from "../pages/GameHost/_components/Table/TableSlice";
import {
  setRiichiPlayer,
  setupTsumo,
  resetButton,
  setupCenterField,
  setScore,
} from "../pages/GameHost/_components/CenterField/CenterFieldSlice";
import {
  openScoreBoard,
  openRyukyokuScoreBoard,
} from "../pages/GameHost/_components/ScoreBoard/ScoreBoardSlice";
import { openResultBoard } from "../pages/GameHost/_components/ResultBoard/ResultBoardSlice";
import { setTurn, setFuro } from "../pages/GameClient/ClientFlagSlice";
import {
  kyokuStart,
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
  window.socket = io(Config.API_URL + ":" + Config.API_PORT, {
    transports: ["websocket"],
  });
  console.log("initSocket");
  console.log(Config.API_URL + ":" + Config.API_PORT);
  console.log(window.socket);
  setupGameHost();
  setupGameClient();
  return window.socket;
}

function setupGameHost() {
  window.socket.on("tablet-kyokustart", (data) => {
    store.dispatch(
      setSidebarState({
        kyoku: data.kyoku,
        honba: data.honba,
        dora: data.dora,
      })
    );
    store.dispatch(
      setupCenterField({
        oya: data.oya,
        player: data.player,
        turnPlayer: data.turnPlayer,
      })
    );
    store.dispatch(resetSutehaiList());
  });

  window.socket.on("tablet-dahai", (data) => {
    store.dispatch(
      dahai({
        playerId: data.playerId,
        pai: data.pai,
        isRiichi: data.isRiichi,
      })
    );

    store.dispatch(
      setScore({
        playerId: data.playerId,
        score: data.score,
      })
    );
  });

  window.socket.on("tablet-riichi", (data) => {
    console.log("tablet-riichi", data);
    store.dispatch(setRiichiPlayer(data));
  });

  window.socket.on("tablet-reset", () => {
    store.dispatch(resetButton());
  });

  window.socket.on("tablet-tsumo", (data) => {
    store.dispatch(setupTsumo(data));
  });

  window.socket.on("tablet-yama", (data) => {
    store.dispatch(setYamaNum(data));
  });

  window.socket.on("tablet-agari", (data) => {
    store.dispatch(openScoreBoard(data));
  });

  window.socket.on("tablet-ryukyoku", (data) => {
    store.dispatch(openRyukyokuScoreBoard(data));
  });

  window.socket.on("tablet-gameover", (data) => {
    console.log(data);
    store.dispatch(openResultBoard(data));
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

function emitTabletSendOk() {
  console.log("send-ok");
  window.socket.emit("tablet-send-ok", { action: "tablet-send-ok" });
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
  window.socket.emit("tsumoAgari", { action: "tsumoAgari" });
}

function setupGameClient() {
  window.socket.on("client-kyokustart", (req) => {
    store.dispatch(kyokuStart(req.kaze));
  });
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
    console.log(req);
    store.dispatch(setFuro({ canRon: req.canRon }));
  });
  window.socket.on("client-end", (req) => {});
}
/*
"client-kyokustart"で{oya:bool}がtrueなら方角(自風)の表示を光らせる
"client-haipai"で{tehai:string[]}の手牌をセット
"client-turnstart"で{turnplayer:bool, canTsumoagari: bool, canRiichi: bool}5に従ってそれらのボタン表示したり，切れるようにする．
"client-nextaction"で{canRon:bool}にあわせてボタンを表示
"client-end"で終了
 */

export { initSocket, setupGameHost, tsumo, riichi, emitTabletSendOk };
export { emitTsumogiri, emitRon, emitDahai, emitTsumoagari };
