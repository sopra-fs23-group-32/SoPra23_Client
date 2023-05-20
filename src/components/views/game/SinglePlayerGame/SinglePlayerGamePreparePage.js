import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api,handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "styles/views/game/GamePrepare.scss";
const UrgeWithPleasureComponent = ({ duration }) => (
  <CountdownCircleTimer
      isPlaying
    duration={duration}
    colors={['#1979B8 ', '#F7B801', '#A30000']}
    colorsTime={[10, 5, 0]}
    size={200}
    strokeWidth={20}
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
);

const  SinglePlayerGamePreparePage = () => {
  const duration = 8;

  // use react-router-dom's hook to access the history
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalRounds, setTotalRounds] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [gameId, setGameId] = useState(0);
  const category = localStorage.getItem("category");
  const score = localStorage.getItem("score");

  const [intervalId, setIntervalId] = useState(null);
  const history = useHistory();

  

  //Counting Time
  useEffect(() => {
      setGameId(localStorage.getItem("gameId"));
      setTotalRounds(localStorage.getItem("totalRounds"));
      setRoundNumber(localStorage.getItem("roundNumber"));
      const intervalId = setInterval(() => {
          setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
      }, 1000);
      return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
      if (secondsLeft === 0) {
          history.push(`/gamePage/${gameId}`);
      }
  }, [secondsLeft, intervalId]);
  
  const handleExitButtonClick = () => {
      history.push("/Home");
  };



    return (
        <div className="round countdown container">
            <div style={{ position: "fixed", top: 75, left: 75 }}>
                <Button
                    style={{ fontSize: "45px", height: "100px", width: "125%" }}
                    onClick={handleExitButtonClick}
                >
                    Exit Game
                </Button>
            </div>
            
            <div className="roundcountdown layout" style={{ dislay: "flex" }}>
        <InformationContainer className="roundcountdown container_left">
          <div style={{ fontSize: "40px" }}>
            Round {roundNumber} of {totalRounds} is starting soon...
          </div>
          <div style={{ fontSize: "30px" }}>
            City Category: {category}, Your Score: {score}
          </div>
        </InformationContainer>
        <div className="roundcountdown layout" style={{ flexDirection: "row" }}>
          <InformationContainer className="roundcountdown container_right">
          <div className="countdown-text">
            <UrgeWithPleasureComponent duration={duration} />
          </div>
          </InformationContainer>
        </div>
      </div>
      <ToastContainer />
        </div>
    );
};
export default SinglePlayerGamePreparePage;
