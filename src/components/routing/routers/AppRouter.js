import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { HomeGuard } from "components/routing/routeProtectors/HomeGuard";
import HomeRouter from "components/routing/routers/HomeRouter";
import { LobbyGuard } from "components/routing/routeProtectors/LobbyGuard";
import { LoginGuard } from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import Register from "components/views/Register";
import Lobby from "components/views/home/Lobby";

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
        <Route exact path="/">
          <Redirect to="/login" />
        </Route>
        <Route exact path="/GamePage">
          <Redirect to="/GamePage" />
        </Route>
        <Route exact path="/login">
          <LoginGuard>
            <Login />
          </LoginGuard>
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route path="/home">
          <HomeGuard>
            <HomeRouter base="/home" />
          </HomeGuard>
          
        </Route>

        <Route path="/GamePage">
          <HomeGuard>
            <HomeRouter base="/GamePage" />
          </HomeGuard>
          
        </Route>


        <Route path="/lobby">
          <LobbyGuard>
            <Lobby />
          </LobbyGuard>
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

/*
 * Don't forget to export your component!
 */
export default AppRouter;
