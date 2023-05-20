import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "styles/views/game/GamePage.scss";
import { api, handleError } from "helpers/api";
import "styles/views/game/Lobby.scss";

import { Grid, Container } from "@mui/material";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";
import GameStatus from "models/GameStatus";

const MultiPlayerGamePage = () => {
<<<<<<< HEAD
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // new state variable
    const [score, setScore] = useState(localStorage.getItem("score"));
    const [correctOption, setCorrectOption] = useState(
        localStorage.getItem("CorrectOption")
    );
    const [selectedCityName, setSelectedCityName] = useState(null);
    const [roundTime, setRoundTime] = useState(0);
    const roundNumber = localStorage.getItem("roundNumber");
    const history = useHistory();
    const gameId = localStorage.getItem("gameId");

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRoundTime((prevTime) => {
                const newTime = prevTime + 1;
                if (isAnswerSubmitted) {
                    clearInterval(intervalId);
                    return newTime;
                } else {
                    return newTime;
                }
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [isAnswerSubmitted]);

    useEffect(() => {
        let subscription;
        const Socket = new SockJS(getDomain() + "/socket");
        const stompClient = Stomp.over(Socket);
        stompClient.connect(
            {},
            (frame) => {
                console.log("Socket connected!");
                console.log(frame);
                subscription = stompClient.subscribe(`/instance/games/${gameId}`, async (message) => {
                    const messagBody = JSON.parse(message.body);
                    if(messagBody.type == WebSocketType.GAME_END) {
                        history.push('/lobby');
                    }
                    else if(messagBody.type == WebSocketType.PLAYER_ADD || messagBody.type == WebSocketType.PLAYRE_REMOVE) {
                        //update userlist
                    } else if(messagBody.type == WebSocketType.ANSWER_UPDATE && messagBody.load == GameStatus.WAITING) {

                        if(localStorage.getItem("roundNumber") == localStorage.getItem("totalRounds")) {
                            endGame();
                        } else if(localStorage.getItem("isServer") == 1) {
                            nextGame();
                        }
                    } else if(messagBody.type == WebSocketType.ROUND_UPDATE) {
                        const currentRound = Number(localStorage.getItem("roundNumber"));
                        localStorage.setItem("roundNumber", currentRound + 1);
                        history.push(`/MultiPlayerGamePage/${gameId}/RoundCountPage/`);
                    }
                });
            },
            (err) => console.log(err)
        );
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    const handleCityNameButtonClick = (cityName) => {
        setSelectedCityName(cityName);
    };

    const cityNamesString = localStorage.getItem("citynames");
    const cityNames = JSON.parse(cityNamesString);

    const endGame = () => { history.push(`/GameFinish/`); };

    const nextGame = async () => {
        const response = await api.put(`/games/${gameId}`);
=======
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(localStorage.getItem("score"));
  const [roundTime, setRoundTime] = useState(localStorage.getItem("countdownTime"));
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [isWaiting, setIsWaiting] = useState(false);

  const gameId = localStorage.getItem("gameId");
  const roundNumber = localStorage.getItem("roundNumber");
  const totalTime = localStorage.getItem("countdownTime");
  const cityNames = JSON.parse(localStorage.getItem("citynames"));
  const correctOption = localStorage.getItem("CorrectOption");
  
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
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e
    }

<<<<<<< HEAD
    const handleExitButtonClick = async () => {
        history.push("/Home");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const playerId = localStorage.getItem("userId");
        try {
            setIsAnswerSubmitted(true);

            const response = await api.post(
                `/games/${gameId}/players/${playerId}/answers`,
                {
                    answer: selectedCityName,
                    timeTaken: roundTime,
                }
            );
            const score2 =
                parseInt(localStorage.getItem("score")) + response.data;

            setScore(score2);
            localStorage.setItem("score", score2);
        } catch (error) {
            console.error("Error submitting answer", error);
        }
    };

    const cityNameButtons = cityNames.map((cityName) => (
        <button
            key={cityName}
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
=======
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
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e
        </button>
    ));

<<<<<<< HEAD
    return (
        <div className="guess-the-city">
            <div className="guess-the-city header">
                <button className="exit-button" onClick={handleExitButtonClick}>
                    Exit
                </button>
            </div>

            <div className="guess-the-city main">
                <Container>
                    <Grid container spacing={4}>
                        <Grid item md={6}>
                            <div>
                                <img
                                    className="city-image"
                                    src={localStorage.getItem("PictureUrl")}
                                    alt="City Image"
                                />
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <p>Your Score: {score}</p>
                            </div>
                        </Grid>
                        <Grid item md={6}>
                            <Grid container justifyContent={"space-around"}>
                                <p>Round {roundNumber}</p>
                                <p>
                                    Time {roundTime}
                                </p>
                            </Grid>
                            <div className="city-button-container">
                                {cityNameButtons}
                                <form
                                    onSubmit={handleSubmit}
                                    className="submit-form"
                                >
                                    {isAnswerSubmitted ? null : (
                                        <button
                                            type="submit"
                                            className="submit-button"
                                        >
                                            Subtmit Answer
                                        </button>
                                    )}
                                </form>
                            </div>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        </div>
    );
=======
      <div className="guess-the-city main">
        <Container>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <div>
                <img className="city-image" alt="GuessImg" src={localStorage.getItem("PictureUrl")}/>
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
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e
};

export default MultiPlayerGamePage;
