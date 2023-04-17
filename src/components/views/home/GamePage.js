import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from 'react-switch';
import PropTypes from "prop-types";
import zurichImage from 'img/staticZurich.jpg';
import "styles/views/home/GamePage.scss";


const GamePage = () => {
  const [roundNumber, setRoundNumber] = useState(localStorage.getItem('totalRounds'));
  const [score, setScore] = useState(0);
  const history = useHistory();
  const [rightCityName, setRightCityName] = useState(localStorage.getItem('rightCity'));
  const [cityNames, setCityNames] = useState(localStorage.getItem('randomcities'));
  const [imageUrl, setImageUrl] = useState(localStorage.getItem('imageUrl'));


  const getGameDetails = async () => {
    const response = await api.get(`/singlemode/${localStorage.getItem('gameId')}/`);
    
    var gameTime = response.data.gameTime;
    var totalRounds = response.data.totalRounds;
    var countdownTime = response.data.countdownTime;
    var cityOptions = response.data.cityOptions;
    var gameEnded = response.data.gameEnded;
    var playerScore = response.data.playerScore;
    var currentRound = response.data.currentRound;
    var imageUrl = response.data.imageUrl;
  
    localStorage.setItem("gameTime", gameTime);
    localStorage.setItem("totalRounds", totalRounds);
    localStorage.setItem("gameEnded", gameEnded);
    localStorage.setItem("playerScore", playerScore);
    localStorage.setItem("gameTime", gameTime);
  };
  
  useEffect(() => {
    getGameDetails();
  }, []);


  const handleCityNameButtonClick = async (selectedCityName) => {
    if (selectedCityName === rightCityName) {
      setScore(score + 1);
    }

  };

  const handleExitButtonClick = () => {
    history.push("/Home");
  };

  const cityNamesString = localStorage.getItem('randomcities');
  const cityNames2 = JSON.parse(cityNamesString);
  
  const cityNameButtons = cityNames2.map((cityName) => (
    <button
      key={cityName}
      className={`city-name-button ${
        cityName === rightCityName ? "correct" : ""
      }`}
      onClick={() => handleCityNameButtonClick(cityName)}
    >
      {cityName}
    </button>
  ));
  
  return (
    <div className="guess-the-city">
      <div className="header">
        <button className="exit-button" onClick={handleExitButtonClick}> Exit </button>
        <div>
          <img className="cityImage" src={imageUrl} alt="City Image" />
        </div>
      </div>
      <div className="main">
        <div className="image-container">
        </div>
        <div className="button-container">
          {cityNameButtons}
        </div>
        <div className="info-container">
          <span className="round-number">Round {roundNumber}</span>
          <span className="score">Score: {score}</span>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
