import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { HomeGuard } from "components/routing/routeProtectors/HomeGuard";
import HomeRouter from "components/routing/routers/HomeRouter";
import { LobbyGuard } from "components/routing/routeProtectors/LobbyGuard";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";

import Login from "components/views/authentication/Login";
import Register from "components/views/authentication/Register";

import Lobby from "components/views/game/Lobby";

import SinglePlayerGamePage from "components/views/game/SinglePlayerGame/SinglePlayerGamePage";
import SinglePlayerGamePreparePage from "components/views/game/SinglePlayerGame/SinglePlayerGamePreparePage";

import CreatedGamePage from "components/views/game/MultiPlayerGame/CreatedGamePage";
import JoinGamePage from "components/views/game/MultiPlayerGame/JoinGame";

import MultiPlayerGamePage from "components/views/game/MultiPlayerGame/MultiPlayerGamePage";
import MultiPlayerGamePreparePage from "components/views/game/MultiPlayerGame/MultiPlayerGamePreparePage";
import MultiPlayerGameFinishPage from "components/views/game/MultiPlayerGame/MultiPlayerGameFinishPage";

import GameFinishPage from "components/views/game/GameFinishPage";

import SinglePlayerGameLobby from "components/views/game/SinglePlayerGame/SinglePlayerGameLobby";
import MultiPlayerGameLobby from "components/views/game/MultiPlayerGame/MultiPlayerGameLobby";
import HistoryPage from "../../views/userinfo/History";

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                {/* default path */}
                <Route exact path="/">
                    <Redirect to="/login" />
                </Route>

                <Route exact path="/login">
                    <LoginGuard>
                        <Login />
                    </LoginGuard>
                </Route>
                <Route exact path={`/userinfo/history`}>
                    <HistoryPage />
                </Route>
                <Route exact path="/register">
                    <Register />
                </Route>

                <Route exact path={`/gamePage/:gameId`}>
                    <SinglePlayerGamePage />
                </Route>

                <Route exact path={`/gamePage/:gameId/RounddownCountdown`}>
                    <SinglePlayerGamePreparePage />
                </Route>

                <Route exact path={`/MultiPlayerGamePage/:gameId`}>
                    <MultiPlayerGamePage />
                </Route>

                <Route exact path={`/MultiGamePage/:gameId/GameFinish`}>
                    <MultiPlayerGameFinishPage />
                </Route>

                <Route
                    exact
                    path={`/MultiPlayerGamePage/:gameId/RoundCountPage`}
                >
                    <MultiPlayerGamePreparePage />
                </Route>

                <Route path="/home">
                    <HomeGuard>
                        <HomeRouter base="/home" />
                    </HomeGuard>
                </Route>

                <Route path="/GameFinish">
                    <GameFinishPage>
                        <HomeRouter base="/home" />
                    </GameFinishPage>
                </Route>

                <Route path="/StartGamePage">
                    <CreatedGamePage />
                </Route>

                <Route path="/JoinGame">
                    <JoinGamePage base="/JoinGame" />
                </Route>

                <Route path="/lobby/singleplayer">
                    <SinglePlayerGameLobby base="/lobby/singleplayer" />
                </Route>

                <Route path="/lobby/multiplayer">
                    <MultiPlayerGameLobby base="/lobby/multiplayer" />
                </Route>
            </Switch>
        </BrowserRouter>
    );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
