import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "styles/views/home/GamePage.scss";

import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from "react-switch";
import PropTypes from "prop-types";
import CityCategory from "models/CityCategory";
import "styles/views/home/Lobby.scss";
const GamePage = () => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // new state variable
  const [score, setScore] = useState(localStorage.getItem("score"));
  const roundNumber = localStorage.getItem("roundNumber");
  const history = useHistory();
  const [correctOption, setCorrectOption] = useState(
    localStorage.getItem("CorrectOption")
  );

  
  
  const [selectedCityName, setSelectedCityName] = useState(null);

  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [option3, setOption3] = useState("");
  const [option4, setOption4] = useState("");
  const gameId = localStorage.getItem("gameId");

  const handleCityNameButtonClick = (cityName) => {
    setSelectedCityName(cityName);
    setIsAnswerSubmitted(true);
    const timeLeft=localStorage.getItem("newTimeLeft");
  };

  const [timeLeft, setTimeLeft] = useState(null);
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
      setCorrectOption(question.correctOption);

      console.log("number current round=" + roundNumber);
      return question;
    } catch (error) {
      throw error;
    }
  };
  const cityNamesString = localStorage.getItem("citynames2");
  const cityNames2 = JSON.parse(cityNamesString);

  const cityNameButtons = cityNames2.map((cityName) => (
    <button
      key={cityName}
      className={`city-name-button ${
        selectedCityName && cityName === correctOption ? "correct" : ""
      } 
      ${
        selectedCityName &&
        cityName === selectedCityName &&
        cityName !== correctOption
          ? "wrong"
          : ""
      }`}
      disabled={selectedCityName !== null}
      onClick={() => handleCityNameButtonClick(cityName)}
    >
      {cityName}
    </button>
  ));

  const handleExitButtonClick = async () => {
    await api.delete(`games/${gameId}`);
    history.push("/Home");
  };

  const countdownTime = localStorage.getItem("sameCoundownTime");

  useEffect(() => {
    const currentUrl = window.location.href;
    console.log(currentUrl);

    setTimeLeft(countdownTime);
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const newTimeLeft = prevTimeLeft - 1;
        if (newTimeLeft <= 0) {
          clearInterval(intervalId);
          let now = localStorage.getItem("roundNumber");
          now++;
          localStorage.setItem("roundNumber", now);
          history.push(`/gamePage/${gameId}/RounddownCountdown`);
        } else {
          localStorage.setItem("countdownTime", newTimeLeft);
        }
        localStorage.setItem("newTimeLeft",newTimeLeft);
        return newTimeLeft;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let now = localStorage.getItem("thisRound");
    now++;
    const playerId = localStorage.getItem("userId");
    console.log("playerId", playerId);
  
    try {
      console.log("ANSWER SUBMITTED: ", {
        answer: selectedCityName,
        countdownTime: localStorage.getItem("countdownTime"),
      });
      console.log("countdown;",localStorage.getItem("countdownTime"))
      const response = await api.post(`/games/${gameId}/players/${playerId}/answers`,
        {
          answer: selectedCityName,
          timeTaken: localStorage.getItem("countdownTime"),
        }
  
      );
      const score2=parseInt(localStorage.getItem("score"))+response.data;
      console.log(score2);

      setScore(score2);
      localStorage.setItem("score",score2);
  
  
      console.log(
        "Answer submitted successfully, response to request is....",
        response
      );
        
    } catch (error) {
      console.error("Error submitting answer", error);
    }
  
    setSelectedCityName(null);
    setTimeout(() => {
      let now = localStorage.getItem("roundNumber");
      now++;
      localStorage.setItem("roundNumber",now);

      history.push(`/gamePage/${gameId}/RounddownCountdown`);
    }, 5000);
  };
  

  

  return (
    <div className="guess-the-city">
      <div className="header">
        <button className="exit-button" onClick={handleExitButtonClick}>
          {" "}
          Exit{" "}
        </button>
        <div>
          <img
            className="cityImage"
            src={localStorage.getItem("PictureUrl")}
            alt="City Image"
          />
        </div>
      </div>
      <div className="main">
        <div className="image-container"></div>
        <div className="button-container">
          {cityNameButtons}
          <form onSubmit={handleSubmit}>
            <button type="submit">Submit Answer</button>
          </form>
          <p>Time Left: {isAnswerSubmitted ? countdownTime  : timeLeft}</p> {/* conditional rendering */}
          {/* Render the city options and submit button here */}
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
