import React, { useEffect } from "react";
import "./reset.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Top } from "./pages/Top";
import { GameClient } from "./pages/GameClient";
import { GameHost } from "./pages/GameHost";
import { RoomHost } from "./pages/RoomHost";
import { EnterRoomClient } from "./pages/EnterRoomClient";
import { initSocket } from "./services/socket";

type Prop = {};
export const App: React.FC<Prop> = () => {
  initSocket();
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Top} />
          <Route exact path="/game_host" component={GameHost} />
          <Route exact path="/room_host" component={RoomHost} />
          <Route exact path="/enter_room_client" component={EnterRoomClient} />
          <Route exact path="/game_client" component={GameClient} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};
