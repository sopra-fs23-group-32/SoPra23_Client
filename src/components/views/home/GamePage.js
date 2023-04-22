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
  const history = useHistory();
  const [option1, setOption1]=useState("");
  const [option2, setOption2]=useState("");
  const [option3, setOption3]=useState("");
  const [option4, setOption4]=useState("");
  const [pictureUrl, setPictureUrl]=useState("");
  const [correctOption, setCorrectOption]=useState("");
  const [score, setScore]=useState("");
  const [roundNumber, setRoundNumber]=useState(0);

  var gameId=localStorage.getItem("gameId")
  var category=localStorage.getItem("category")
  var totalRounds=localStorage.getItem("totalRounds")
  var countdownTime=localStorage.getItem("countdownTime")
  

  const handleCityNameButtonClick = async (selectedCityName) => {
    if (selectedCityName === correctOption) {
      setScore(score + 1);
    }

  };

  const handleExitButtonClick = () => {
    history.push("/Home");
  };

  const cityNamesString = localStorage.getItem("citynames2");
  const cityNames2 = JSON.parse(cityNamesString);
  console.log("Citynames2: ",cityNames2);
  const cityNameButtons = cityNames2.map((cityName) => (
    <button
      key={cityName}
      className={`city-name-button ${
        cityName === correctOption ? "correct" : ""
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
          <img className="cityImage" src={localStorage.getItem("PictureUrl")} alt="City Image" />
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
