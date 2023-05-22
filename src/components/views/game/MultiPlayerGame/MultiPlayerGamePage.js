import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "styles/views/game/GamePage.scss";
import { api, handleError } from "helpers/api";
import "styles/views/game/Lobby.scss";

import { Grid, Container } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";
<<<<<<< HEAD
import GameStatus from "models/GameStatus";

const MultiPlayerGamePage = () => {
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // new state variable
    const [score, setScore] = useState(localStorage.getItem("score"));
    const [correctOption, setCorrectOption] = useState(
        localStorage.getItem("CorrectOption")
    );
    const [selectedCityName, setSelectedCityName] = useState(null);
    const [roundTime, setRoundTime] = useState(0);
    const [isSurvivalMode, setIsSurvivalMode] = useState(
        localStorage.getItem("survival")
    );
    const [gameFinished, setGameFinished] = useState(false);
    const [imageUrl, setImageUrl] = useState(
        localStorage.getItem("PictureUrl")
    );

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
                subscription = stompClient.subscribe(
                    `/instance/games/${gameId}`,
                    async (message) => {
                        const messagBody = JSON.parse(message.body);
                        if (messagBody.type == WebSocketType.GAME_END) {
                            history.push("/lobby");
                        } else if (
                            messagBody.type == WebSocketType.PLAYER_ADD ||
                            messagBody.type == WebSocketType.PLAYER_REMOVE
                        ) {
                            //update userlist
                        } else if (
                            messagBody.type == WebSocketType.ANSWER_UPDATE &&
                            messagBody.load == GameStatus.WAITING
                        ) {
                            console.log("AnswerUpdate");
                            if (
                                localStorage.getItem("roundNumber") ==
                                localStorage.getItem("totalRounds")
                            ) {
                                endGame();
                            }
                            nextGame();
                        } else if (
                            messagBody.type == WebSocketType.ROUND_UPDATE
                        ) {
                            const currentRound = Number(
                                localStorage.getItem("roundNumber")
                            );
                            localStorage.setItem(
                                "roundNumber",
                                currentRound + 1
                            );
                            history.push(
                                `/MultiPlayerGamePage/${gameId}/RoundCountPage/`
                            );
                        }
                    }
                );
            },
            (err) => console.log(err)
        );
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const handleCityNameButtonClick = (cityName) => {
        setSelectedCityName(cityName);
    };

    const cityNamesString = localStorage.getItem("citynames");
    const cityNames = JSON.parse(cityNamesString);

    const finishGame = () => {
        localStorage.setItem("gameFinished", true);
        history.push(`/GameFinish/`);
    }

    const endGame = () => {
        localStorage.setItem("gameEnded", true);
        history.push(`/GameFinish/`);
    };

    const nextGame = async () => {
        const response = await api.put(`/games/${gameId}`);
    };

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

            if (response.data === 0 && isSurvivalMode === "true") {
                setTimeout(() => {
                    console.log("finished");
                    finishGame();
                }, 3000);
            }
            const score2 =
                parseInt(localStorage.getItem("score")) + response.data;

            setScore(score2);
            localStorage.setItem("score", score2);
        } catch (error) {
            console.error("Error submitting answer", error);
=======

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/views/game/GamePage.scss";

const MultiPlayerGamePage = () => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(localStorage.getItem("myScore"));
  const [roundTime, setRoundTime] = useState(
    localStorage.getItem("countdownTime")
  );
  const [selectedCityName, setSelectedCityName] = useState(null);
  // control the flow
  const [isWaiting, setIsWaiting] = useState(true);
  const [isContinue, setIsContinue] = useState(false);

  const gameId = localStorage.getItem("gameId");
  const roundNumber = localStorage.getItem("roundNumber");
  const totalTime = localStorage.getItem("countdownTime");
  const cityNames = JSON.parse(localStorage.getItem("citynames"));
  const correctOption = localStorage.getItem("CorrectOption");
  const playerId = localStorage.getItem("userId");
  const isServer = localStorage.getItem("isServer");
  const history = useHistory();

  const endRound = () => {
    // remove all local storage of previous question
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    // go to next page
    if (
      localStorage.getItem("roundNumber") ===
      localStorage.getItem("totalRounds")
    ) {
      history.push(`/MultiGamePage/${gameId}/GameFinish`);
    } else {
      localStorage.setItem("roundNumber", Number(roundNumber) + 1);
      history.push(`/MultiGamePage/${gameId}/RoundCountPage`);
    }
  };
  /*
  // handle msg from the web socket
  useEffect(() => {
    let subscription;
    const Socket = new SockJS(getDomain() + "/socket");
    const stompClient = Stomp.over(Socket);
    stompClient.connect(
      {}, (frame) => {
        subscription = stompClient.subscribe(
          `/instance/games/${gameId}`,
          async (message) => {
            const messagBody = JSON.parse(message.body);
            console.log("Socket receive msg: ", messagBody);
            if (messagBody.type === WebSocketType.ANSWER_UPDATE 
              && messagBody.load === GameStatus.WAITING) {
              setIsWaiting(false);
              // have press the button
              if(isContinue) {
                endRound();
              }
            }
            // else if (messagBody.type === WebSocketType.GAME_END) {
            //   history.push("/lobby");
            // }
          }
        );
      },
      (err) => console.log(err)
    );
    return () => {subscription.unsubscribe();};
  }, []); */

  const submitAnswer = async (cityName, time) => {
    setIsAnswerSubmitted(true);
    try {
      const response = await api.post(
        `/games/${gameId}/players/${playerId}/answers`,
        { answer: cityName, timeTaken: time }
      );
      const score_new = parseInt(score) + response.data;
      setScore(score_new);
      localStorage.setItem("myScore", score_new);
    } catch (error) {
      toast.error(
        `Failed in submitting answer: \n${error.respond.data.message}`
      );
      console.log(handleError(error));
    }
  };

  const fetchGameStatus = async () => {
    try {
      const response = await api.get(
        `/games/${localStorage.getItem("gameId")}/status`
      );
      console.log("GameStatus", response.data);
      if(response.data=== "WAITING"){
        setIsWaiting(false);
        // have pressed the button
        if(isContinue){
          endRound();
        }
      }
    } catch (error) {
      toast.error(`Failed to fetch player in game(ID ${gameId})\n //change this
        ${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  useEffect(() => {
    const interval1 = setInterval(fetchGameStatus, 2000);
    return () => {
      clearInterval(interval1); // Clean up the interval on component unmount
    };
  }, [isWaiting===true]);

  // submit "no answer" when times up
  useEffect(() => {
    const intervalId = setInterval(() => {
      setRoundTime((prevTimeLeft) => {
        const newTimeLeft = prevTimeLeft - 1;
        if (newTimeLeft <= 0) {
          clearInterval(intervalId);
          if (!isAnswerSubmitted) {
            submitAnswer("no answer", totalTime);
          }
>>>>>>> main
        }
    };
    const refreshImage = async () => {
        const response = await api.get(`/games/refresh/${gameId}`);
        setImageUrl(response.data);
        localStorage.setItem("PictureUrl", response.data);
    };

<<<<<<< HEAD
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
        </button>
    ));

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
                                <div
                                    className="city-image-refresh"
                                    onClick={() => refreshImage()}
                                >
                                    <button className="city-image-refresh-button">
                                        <AutorenewIcon fontSize="large" />
                                    </button>
                                </div>
                                <img
                                    className="city-image"
                                    src={imageUrl}
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
                                <p>Time {roundTime}</p>
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
=======
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAnswerSubmitted) {
      submitAnswer(selectedCityName, totalTime - roundTime);
    } else {
      setIsContinue(true);
      if (isWaiting) {
        // press but not ok yet
        toast.info(`Waiting for other players to answer...`);
      } else {
        // you are the last one
        endRound();
      }
    }
  };

  const handleCityNameButtonClick = (cityName) => {
    setSelectedCityName(cityName);
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
    </button>
  ));

  const handleExitButtonClick = async () => {
    await api.delete(`games/${gameId}/players/${playerId}`);
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("myScore");
    localStorage.removeItem("isServer");
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    history.push("/home");
  };

  return (
    <div className="guess-the-city">
      <div className="guess-the-city header">
        <Button
          className="exit-button"
          onClick={handleExitButtonClick}
          disabled={isServer === "true"}
        >
          Exit Game
        </Button>
      </div>

      <div className="guess-the-city main">
        <Container>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <div>
                <img
                  className="city-image"
                  alt="GuessImg"
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
            {isWaiting && isAnswerSubmitted ? "Waiting for other players" : ""}
          </span>
>>>>>>> main
        </div>
    );
};

export default MultiPlayerGamePage;
