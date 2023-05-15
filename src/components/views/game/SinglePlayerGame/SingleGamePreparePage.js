import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from "react-switch";
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

const RoundCountdown = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  const [duration, setDuration] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [intervalId, setIntervalId] = useState(null);
  const gameId = localStorage.getItem("gameId");

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
//    if(secondsLeft===8){
//      getGameDetails(gameId);
//    }

    if (secondsLeft === 0) {
      clearInterval(secondsLeft);
      clearInterval(intervalId);
      setTimeout(() => {
        history.push(`/SingleGamePage/${gameId}`);
      }, 500);
    }
  }, [secondsLeft, intervalId]);

  const getGameDetails = async (gameId) => {
    try {
      const response = await api.put(`/games/${gameId}`);
      const question = response.data;
      const cityNamesString = JSON.stringify([
        question.option1,
        question.option2,
        question.option3,
        question.option4,
      ]);
      localStorage.setItem("citynames2", cityNamesString);
      localStorage.setItem("PictureUrl", question.pictureUrl);
      localStorage.setItem("CorrectOption", question.correctOption);
      
    } catch (error) {
      throw error;
    }
  };

  const handleExitButtonClick = async () => {
    await api.delete(`games/${localStorage.getItem("gameId")}`);
    history.push("/home");
  };

  const roundNumber = localStorage.getItem("roundNumber");
  const totalRounds = localStorage.getItem("totalRounds");
  const score = localStorage.getItem("score");

  console.log("total: ",totalRounds, "roundNumber:",roundNumber);
  if (roundNumber > totalRounds) {
    history.push(`/SingleGamePage/${gameId}/GameFinishPage`);
  }

  return (
    <div className="round countdown container">
      <div style={{ position: "fixed", top: 75, left: 75 }}>
        <Button
          style={{ fontSize: "45px", height: "100px", width: "125%" }}
          onClick={handleExitButtonClick}
        >
          Exit
        </Button>
      </div>
      <div style={{ dislay: "flex" }}>
        <InformationContainer
          className="roundcountdown container_left"
          id="information-container"
        >
          <div style={{ fontSize: "40px" }}>
            Round {roundNumber} of {totalRounds} is starting soon...
          </div>
          <div style={{ fontSize: "30px" }}>
            Your Score: {score}
          </div>
        </InformationContainer>
        <div className="roundcountdown layout" style={{ flexDirection: "row" }}>
          <InformationContainer
            className="roundcountdown container_right"
            id="information-container"
          >
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
export default RoundCountdown;
