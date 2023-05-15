import {Redirect, Route} from "react-router-dom";
import PropTypes from 'prop-types';
import Home from "components/views/home/Home";
import Profile from "components/views/home/Profile"

import ScoreBoard from "components/views/home/ScoreBoard"
import HistoryPage from '../../views/history/History';
import SingleGamePage from "components/views/game/SingleGame/SingleGamePage";
import GameFinishPage from "components/views/game/GameFinishPage"
import JoinGame from "components/views/game/JoinGame";

const HomeRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of HomeRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}`}>
        <Redirect to={`${props.base}/dashboard`}/>
      </Route>
      <Route exact path={`${props.base}/dashboard`}>
        <Home/>
      </Route>
      <Route exact path={`${props.base}/scoreboard`}>
        <ScoreBoard />
      </Route>
      <Route exact path={`${props.base}/profile`}>
        <Profile />
      </Route>

      <Route exact path={`${props.base}/history`}>
        <HistoryPage/>
      </Route>
      <Route exact path={`${props.base}/RoundCountdown`}>
        <SingleGamePage/>
      </Route>
      <Route exact path={`${props.base}/GameFinish`}>
        <GameFinishPage/>
      </Route>
      <Route exact path={`${props.base}/JoinGame`}>
        <JoinGame/>
      </Route>

    </div>
  );
};
/*
* Don't forget to export your component!
 */

HomeRouter.propTypes = {
  base: PropTypes.string
}

export default HomeRouter;
