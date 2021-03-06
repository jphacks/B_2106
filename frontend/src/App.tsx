import React from "react";
import "./App.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Top } from "./pages/Top";
import { GameClient } from "./pages/GameClient";
import { GameHost } from "./pages/GameHost";
import { RoomHost } from "./pages/RoomHost";
import { EnterRoomClient } from "./pages/EnterRoomClient";
import { initSocket } from "./services/socket";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { Socket } from "socket.io-client";

type Prop = {};

export let SocketContext: React.Context<
  Socket<DefaultEventsMap, DefaultEventsMap>
>;

export const App: React.FC<Prop> = () => {
  const socket = initSocket();
  SocketContext =
    React.createContext<Socket<DefaultEventsMap, DefaultEventsMap>>(socket);

  return (
    <div className="App">
      <div className="Blocker">
        <img className="Blocker__icon" src="./images/rotate.png" alt="" />
        <span className="Blocker__text">端末を横に向けてください</span>
      </div>
      <SocketContext.Provider value={socket}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Top} />
            <Route exact path="/game_host" component={GameHost} />
            <Route exact path="/room_host" component={RoomHost} />
            <Route exact path="/game_client" component={GameClient} />
            <Route
              exact
              path="/enter_room_client"
              component={EnterRoomClient}
            />
            <Route path="/enter_room_client/:id" component={EnterRoomClient} />
          </Switch>
        </BrowserRouter>
      </SocketContext.Provider>
    </div>
  );
};
