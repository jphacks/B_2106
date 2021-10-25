import React from "react";
import "./App.css";
import "./reset.css";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Top from "./pages/Top";
import GameClient from "./pages/GameClient";
import GameHost from "./pages/GameHost";
import RoomHost from "./pages/RoomHost";
import EnterRoomClient from "./pages/EnterRoomClient";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ul>
          <li>
            <Link to="/">Top</Link>
          </li>
          <li>
            <Link to="/game_host">GameHost</Link>
          </li>
          <li>
            <Link to="/room_host">RoomHost</Link>
          </li>
          <li>
            <Link to="/enter_room_client">EnterRoomClient</Link>
          </li>
          <li>
            <Link to="/game_client">GameClient</Link>
          </li>
        </ul>
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
}

export default App;
