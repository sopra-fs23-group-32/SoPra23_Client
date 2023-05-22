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
        }
    };
    const refreshImage = async () => {
        const response = await api.get(`/games/refresh/${gameId}`);
        setImageUrl(response.data);
        localStorage.setItem("PictureUrl", response.data);
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
        </div>
    );
};

export default MultiPlayerGamePage;
