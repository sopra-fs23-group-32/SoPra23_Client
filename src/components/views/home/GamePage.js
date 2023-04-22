import { useHistory } from "react-router-dom";
import React, { useState, useEffect} from 'react';
import "styles/views/home/GamePage.scss";

import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from 'react-switch';
import PropTypes from "prop-types";
import CityCategory from "models/CityCategory"
import "styles/views/home/Lobby.scss";

const GamePage = () => {
  const history = useHistory();
  const [correctOption, setCorrectOption] = useState(localStorage.getItem("CorrectOption"));

  const [score, setScore]=useState(0);
  const [roundNumber, setRoundNumber]=useState(1);
  const [selectedCityName, setSelectedCityName] = useState(null);
  
  const [option1, setOption1]=useState("");
  const [option2, setOption2]=useState("");
  const [option3, setOption3]=useState("");
  const [option4, setOption4]=useState("");





  const getGameDetails = async (gameId) => {
    console.log("erreicht");
    try {
      console.log("before call");
      const response = await api.put(`/games/${gameId}`);
      const question = response.data;
      console.log("question otpion1", question.option1);
      console.log("Option1: ",option1, "Option2: ",option2,"Option3: ",option3, "Option4: ",option4)

      const cityNamesString = JSON.stringify([question.option1, question.option2, question.option3, question.option4]);
      console.log("CityNameString: ", cityNamesString);
      localStorage.setItem("citynames2", cityNamesString);
      localStorage.setItem("PictureUrl",question.pictureUrl);
      localStorage.setItem("CorrectOption",question.correctOption);
      
      return question;
    } catch (error) {
      throw error;
    }
  };


  const handleExitButtonClick = () => {
    history.push("/Home");
  };

    
  const handleCityNameButtonClick = async (selectedCityName) => {
    setSelectedCityName(selectedCityName);
    const gameId=localStorage.getItem("gameId")
    
    console.log("gameid: ",gameId)
    const correctOption=localStorage.getItem("CorrectOption")
    if (selectedCityName === correctOption) {
      console.log("richtig");
      
      setTimeout(5);
      getGameDetails(gameId);
      setScore(score + 1);

    }

  };

  

  const cityNamesString = localStorage.getItem("citynames2");
  const cityNames2 = JSON.parse(cityNamesString);
  

  const cityNameButtons = cityNames2.map((cityName) => (
    <button
      key={cityName}
      className={`city-name-button ${selectedCityName &&cityName === correctOption ? "correct" : ""} 
      ${selectedCityName && cityName === selectedCityName && cityName !== correctOption ? "wrong" : ""}
      `}
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
