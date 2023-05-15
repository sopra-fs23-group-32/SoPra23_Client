import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { HomeGuard } from "components/routing/routeProtectors/HomeGuard";
import HomeRouter from "components/routing/routers/HomeRouter";
import { LobbyGuard } from "components/routing/routeProtectors/LobbyGuard";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";

import Login from "components/views/Login";
import Register from "components/views/Register";

import StartGamePage from "components/views/game/StartGamePage";

import SingleGamePage from "components/views/game/SingleGame/SingleGamePage";
import SinglePreparePage from "components/views/game/SingleGame/SinglePreparePage";

import CreatedGamePage from "components/views/game/MultiGame/CreatedGamePage";
import JoinGamePage from "components/views/game/MultiGame/JoinGamePage";

import MultiGamePage from "components/views/game/MultiGame/MultiGamePage";
import MultiPreparePage from "components/views/game/MultiGame/MultiPreparePage";

import GameFinishPage from "components/views/game/GameFinishPage";


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
                <Route exact path="/register">
                    <Register />
                </Route>

                <Route exact path={`/gamePage/:gameId`}>
                    <SingleGamePage />
                </Route>

                <Route exact path={`/gamePage/:gameId/RounddownCountdown`}>
                    <SinglePreparePage />
                </Route>

                <Route exact path={`/MultiGamePage/:gameId`}>
                    <MultiGamePage />
                    
                </Route>
                <Route exact path={`/MultiGamePage/:gameId/RoundCountPage`}>
                    <MultiPreparePage />
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

                <Route path="/lobby">
                    <LobbyGuard>
                        <StartGamePage />
                    </LobbyGuard>
                </Route>

                <Route path="/StartGamePage">
                    <CreatedGamePage />
                </Route>

                <Route path="/JoinGame">
                    <JoinGamePage base="/JoinGame" />
                </Route>

            </Switch>
        </BrowserRouter>
    );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
