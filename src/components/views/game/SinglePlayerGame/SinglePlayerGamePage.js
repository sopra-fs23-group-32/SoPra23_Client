import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { api } from "helpers/api";
import { Grid, Container } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "styles/views/game/Lobby.scss";
import "styles/views/game/GamePage.scss";


const SinglePlayerGamePage = () => {
    const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // new state variable
    const [score, setScore] = useState(localStorage.getItem("score"));
    const [roundTime, setRoundTime] = useState(15);
    const [roundNumber, setRoundNumber] = useState(localStorage.getItem("roundNumber"));
    const [correctOption, setCorrectOption] = useState(localStorage.getItem("CorrectOption"));
    const [selectedCityName, setSelectedCityName] = useState(null);
    const [gameId, setGameId] = useState(localStorage.getItem("gameId"));
    
    const history = useHistory();

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRoundTime((prevTimeLeft) => {
                const newTimeLeft = prevTimeLeft - 1;
                if (newTimeLeft <= 0) {
                    clearInterval(intervalId);
                    setIsAnswerSubmitted(true);
                }
                return newTimeLeft;
            });
        }, 1000);
        return () => clearInterval(intervalId);
    }, [history]);

    const endGame = async (gameId) => {
        history.push(`/GameFinish/`);
    };

    const nextGame = async () => {
        if(localStorage.getItem("roundNumber") == localStorage.getItem("totalRounds")) {
            endGame(localStorage.getItem("gameId"));
            return;
        }
        localStorage.setItem("roundNumber", Number(roundNumber) + 1);
        await getNextGameDetail(gameId);
        history.push(`/gamePage/${gameId}/RounddownCountdown`);
    }
    
    const handleCityNameButtonClick = (cityName) => {
        setSelectedCityName(cityName);
    };

    const getNextGameDetail = async (gameId) => {
        try {
            const response = await api.put(`/games/${gameId}`);
            const question = response.data;
            const cityNamesString = JSON.stringify([
                question.option1,
                question.option2,
                question.option3,
                question.option4,
            ]);
            localStorage.setItem("citynames", cityNamesString);
            localStorage.setItem("PictureUrl", question.pictureUrl);
            localStorage.setItem("CorrectOption", question.correctOption);
            return;
        } catch (error) {
            throw error;
        }
    };
    const cityNamesString = localStorage.getItem("citynames");
    const cityNames = JSON.parse(cityNamesString);

    const handleExitButtonClick = async () => {
        await api.delete(`games/${localStorage.getItem("gameId")}`);
        history.push("/Home");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAnswerSubmitted) {
            const playerId = localStorage.getItem("userId");
            try {
                setIsAnswerSubmitted(true);
                
                const response = await api.post(
                    `/games/${gameId}/players/${playerId}/answers`,
                    {
                        answer: selectedCityName,
                        timeTaken: 15 - roundTime,
                    }
                );
                const score2 =
                    parseInt(localStorage.getItem("score")) + response.data;
                setScore(score2);

                localStorage.setItem("score", score2);
            } catch (error) {
                console.error("Error submitting answer", error);
            }
        } else {
            nextGame();
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
                                <p className="round-time">{roundTime}</p>
                            </Grid>
                            <div className="city-button-container">
                                {cityNameButtons}
                                <form
                                    onSubmit={handleSubmit}
                                    className="submit-form"
                                >
                                    <button
                                        type="submit"
                                        className="submit-button"
                                    >
                                        {isAnswerSubmitted
                                            ? "Next"
                                            : "Subtmit Answer"}
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
                </div>
            </div>
        </div>
    );
};

export default SinglePlayerGamePage;


