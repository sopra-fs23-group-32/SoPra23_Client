import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { Grid, Container } from "@mui/material";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";
import GameStatus from "models/GameStatus";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "styles/views/game/GamePage.scss";

const MultiPlayerGamePage = () => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(localStorage.getItem("score"));
  const [roundTime, setRoundTime] = useState(localStorage.getItem("countdownTime"));
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const cityNames = JSON.parse(localStorage.getItem("citynames"));
  const correctOption = localStorage.getItem("CorrectOption");
  const roundNumber = localStorage.getItem("roundNumber");
  const totalTime = localStorage.getItem("countdownTime");
  const gameId = localStorage.getItem("gameId");
  const playerId = localStorage.getItem("userId");

  const history = useHistory();

  const endRound = () => {
    // remove all local storage of previous question
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    // go to next page
    if (localStorage.getItem("roundNumber") === localStorage.getItem("totalRounds")) {
      history.push(`/MultiGamePage/${gameId}/GameFinish`);
    }
    else {
      localStorage.setItem("roundNumber", Number(roundNumber) + 1);
      history.push(`/MultiGamePage/${gameId}/RoundCountPage`);
    }
  };

  // handle msg from the web socket
  useEffect(() => {
    let subscription;
    const Socket = new SockJS(getDomain() + "/socket");
    const stompClient = Stomp.over(Socket);
    stompClient.connect(
      {}, (frame) => {
        console.log("Socket connected!");
        console.log(frame);
        subscription = stompClient.subscribe(
          `/instance/games/${gameId}`,
          async (message) => {
            const messagBody = JSON.parse(message.body);
            if (messagBody.type === WebSocketType.ANSWER_UPDATE 
              && messagBody.load === GameStatus.WAITING) {
              endRound();
            }
            else if (messagBody.load === GameStatus.ANSWERING) {
              setIsWaiting(true);
            }
            // else if (messagBody.type === WebSocketType.PLAYER_ADD 
            //   || messagBody.type === WebSocketType.PLAYRE_REMOVE) {
            //   //update userlist
            // }
            // else if (messagBody.type === WebSocketType.GAME_END) {
            //   history.push("/lobby");
            // }
          }
        );
      },
      (err) => console.log(err)
    );
    return () => {subscription.unsubscribe();};
  }, []);

  const submitAnswer = async(cityName, time) => {
    setIsAnswerSubmitted(true);
    try {
      const response = await api.post(
        `/games/${gameId}/players/${playerId}/answers`,
        {answer: cityName, timeTaken: time,}
      );
      const score_new = parseInt(localStorage.getItem("score")) + response.data;
      setScore(score_new);
      localStorage.setItem("score", score_new);
    } catch (error) {
      toast.error(`Failed in submitting answer: \n${error.respond.data.message}`);
      console.log(handleError(error));
    }
  }

  // submit "no answer" when times up
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRoundTime((prevTimeLeft) => {
        const newTimeLeft = prevTimeLeft - 1;
        if (newTimeLeft <= 0) {
          clearInterval(intervalId);
          if(!isAnswerSubmitted) {
            submitAnswer("no answer", totalTime);
          }
        }
        return newTimeLeft;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isAnswerSubmitted]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAnswerSubmitted) {
      submitAnswer(selectedCityName, totalTime - roundTime);
    }
  };

  const handleCityNameButtonClick = (cityName) => {
    setSelectedCityName(cityName);
  }; 

  const cityNameButtons = cityNames.map((cityName) => (
    <button key={cityName}
      className={`city-name-button ${
        isAnswerSubmitted
          ? cityName === correctOption
            ? "green-button"
            : cityName === selectedCityName
            ? "yellow-button"
            : "white-button"
          : cityName === selectedCityName
          ? "dark-button"
          : "blue-button"
      }`}
      disabled={isAnswerSubmitted === true}
      onClick={() => handleCityNameButtonClick(cityName)}
    >
      {cityName}
    </button>
  ));

  const handleExitButtonClick = async () => {
    await api.delete(`games/${gameId}/players/${playerId}`);
    history.push("/home");
  };

  return (
    <div className="guess-the-city">
      <div className="guess-the-city header">
        <button className="exit-button" onClick={handleExitButtonClick}>
          Exit Game
        </button>
      </div>

      <div className="guess-the-city main">
        <Container>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <div>
                <img className="city-image" alt="City Image" 
                  src={localStorage.getItem("PictureUrl")}
                />
              </div>
              <div style={{ textAlign: "center" }}>
                <p>Your Score: {score}</p>
              </div>
            </Grid>
            <Grid item md={6}>
              <Grid container justifyContent={"space-around"}>
                <p>Round {roundNumber}</p>
                <p className="round-time">{roundTime}</p>
              </Grid>
              <div className="city-button-container">
                {cityNameButtons}
                <form onSubmit={handleSubmit} className="submit-form">
                  <button type="submit" className="submit-button">
                    {isAnswerSubmitted ? "Next" : "Submit Answer"}
                  </button>
                </form>
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>

      <div className="main">
        <div className="info-container">
          <span className="round-number">Round {roundNumber}</span>
          <span className="score">Score: {score}</span>
          <span className="score">
            {isWaiting&&isAnswerSubmitted ? "Waiting for other players" : ""}
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MultiPlayerGamePage;
