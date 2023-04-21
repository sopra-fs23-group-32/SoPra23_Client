import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import "styles/views/home/GamePage.scss";


const RoundCountdown = () => {
  const [roundNumber, setRoundNumber] = useState(localStorage.getItem('totalRounds'));
  const [score, setScore] = useState(0);
  const history = useHistory();

  const getGameDetails = async () => {  
    localStorage.getItem("totalRounds", totalRounds);
    localStorage.getItem("gameEnded", gameEnded);
    localStorage.getItem("playerScore", playerScore);
  };
  
  useEffect(() => {
    getGameDetails();
  }, []);

  const handleExitButtonClick = () => {
    history.push("/Home");
  };
  
  return (
    <div className="round countdown container">
        <Button className="exit-button" onClick={handleExitButtonClick}> Exit </Button>
      <div className="main">
        <div className="image-container">
        </div>
        <div className="info-container">
          <span className="round-number">Round {roundNumber}</span>
          <span className="score">Score: {score}</span>
        </div>
      </div>
    </div>
  );
};

export default RoundCountdown;
