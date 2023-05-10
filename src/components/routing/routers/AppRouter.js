import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import { HomeGuard } from "components/routing/routeProtectors/HomeGuard";
import HomeRouter from "components/routing/routers/HomeRouter";
import { LobbyGuard } from "components/routing/routeProtectors/LobbyGuard";

import Login from "components/views/Login";
import Register from "components/views/Register";
import Lobby from "components/views/home/Lobby";
import JoinGame from "components/views/game/JoinGame";
import RoundCountdown from "components/views/game/RoundCountdown";

import SingleGamePreparePage from "components/views/game/SinglePlayerGame/SingleGamePreparePage";
import SingleGamePage from "components/views/game/SinglePlayerGame/SingleGamePage";

import CreatedGamePage from "components/views/game/MultiPlayerGame/CreatedGamePage";
import MutliPlayerGamePreparePage from "components/views/game/MultiPlayerGame/MultiPlayerGamePreparePage";
import MultiPlayerGamePage from "components/views/game/MultiPlayerGame/MultiPlayerGamePage";
import MultiPlayerGameFinishPage from "components/views/game/MultiPlayerGame/GameFinishPage";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login" and another Router that matches the route "/home".
 *
 * /login renders another component without any sub-route
 * /home renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* default path */}
        {/* <Route exact path="">
          <Redirect to="/login" />
        </Route> */}
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>

        <Route exact path="/login">
          <LoginGuard><Login /></LoginGuard>
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route path="/home">
          <HomeGuard><HomeRouter base="/home" /></HomeGuard>
        </Route>
        <Route path="/lobby">
          <LobbyGuard><Lobby /></LobbyGuard>
        </Route>

        <Route exact path={`/gamePage/:gameId`}>
          <SingleGamePage />
        </Route>
        
        <Route exact path={`/gamePage/:gameId/RounddownCountdown`}>
          <RoundCountdown />
        </Route>

        <Route path="/StartGamePage">
          <CreatedGamePage />
        </Route>
        <Route path="/JoinGame">
          <JoinGame base="/JoinGame" />
        </Route>
        <Route exact path={`/MultiGamePage/:gameId/RoundCountPage`}>
          <MutliPlayerGamePreparePage />
        </Route>
        <Route exact path={`/MultiGamePage/:gameId`}>
          <MultiPlayerGamePage />        
        </Route>
                
        <Route path="/RoundCountdown">
          <HomeGuard>
            <HomeRouter base="/RoundCountdown" />
          </HomeGuard>
        </Route>

      </Switch>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
