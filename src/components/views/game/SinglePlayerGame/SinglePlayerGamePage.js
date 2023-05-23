import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { api, handleError } from "helpers/api";
import { Grid, Container } from "@mui/material";
import { Button } from "components/ui/Button";
import AutorenewIcon from "@mui/icons-material/Autorenew";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/views/game/GamePage.scss";

const SingleGamePage = () => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false); // new state variable
  const [score, setScore] = useState(localStorage.getItem("score"));
  const [roundTime, setRoundTime] = useState(localStorage.getItem("countdownTime"));
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [imageUrl, setImageUrl] = useState(localStorage.getItem("PictureUrl"));

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
      history.push(`/SingleGamePage/${gameId}/GameFinishPage`);
    }
    else {
      localStorage.setItem("roundNumber", Number(roundNumber) + 1);
      history.push(`/SingleGamePage/${gameId}/RoundCountPage`);
    }
  };

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
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAnswerSubmitted) {
      submitAnswer(selectedCityName, totalTime - roundTime);
    }
    else {
      endRound();
    }
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
      onClick={() => setSelectedCityName(cityName)}
    >
      {cityName}
    </button>
  ));

  async function refreshImage() {
    try {
      const response = await api.put(`games/${gameId}/refresh`);
      setImageUrl(response.data);
      console.log("New Image URL got.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info(`Image of ${correctOption} refreshed.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  }
      
  const handleExitButtonClick = async () => {
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("score");
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    await api.delete(`games/${gameId}`);
    history.push("/home");
  };

  return (
    <div className="page-container">
    <div className="guess-the-city">
      <div style={{ position: "fixed", top: 75, left: 75 }}>
        <Button  style={{ fontSize: "45px", height: "100px", width: "100%" }}
         onClick={handleExitButtonClick}>
          Exit Game
        </Button>
      </div>

      <div className="guess-the-city main">
        <Container>
          <Grid container spacing={4}>
            <Grid item md={6}>
              <div className="city-image-refresh" >
                <button className="city-image-refresh-button" 
                  onClick={() => refreshImage()}>
                    <AutorenewIcon fontSize="large" />
                </button>
              </div>
              <div style={{ alignItems: 'center', display: "block"}}>
                <img className="city-image" alt="GuessImg" src={imageUrl}/>
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
        </div>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
};

export default SingleGamePage;