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
  const [roundTime, setRoundTime] = useState(
    localStorage.getItem("countdownTime")
  );
  const [selectedCityName, setSelectedCityName] = useState(null);
  const [imageUrl, setImageUrl] = useState(localStorage.getItem("PictureUrl"));
  const [isLose, setIsLose] = useState(0);

  const gameId = localStorage.getItem("gameId");
  const isSurvivalMode = localStorage.getItem("isSurvivalMode");
  const roundNumber = localStorage.getItem("roundNumber");
  const totalRounds = localStorage.getItem("totalRounds");
  const totalTime = localStorage.getItem("countdownTime");
  const cityNames = JSON.parse(localStorage.getItem("citynames"));
  const correctOption = localStorage.getItem("CorrectOption");
  
  const playerId = localStorage.getItem("userId");

  const history = useHistory();

  const endRound = () => {
    if (isLose === 1) {
      history.push(`/SingleGamePage/${gameId}/GameFinishPage`);
    } else if (roundNumber === totalRounds) {
      history.push(`/SingleGamePage/${gameId}/GameFinishPage`);
    } else {
      localStorage.setItem("roundNumber", Number(roundNumber) + 1);
      history.push(`/SingleGamePage/${gameId}/RoundCountPage`);
    }
  };

  const submitAnswer = async (cityName, time) => {
    setIsAnswerSubmitted(true);
    try {
      const response = await api.post(
        `/games/${gameId}/players/${playerId}/answers`,
        { answer: cityName, timeTaken: time }
      );
      const score_new = parseInt(localStorage.getItem("score")) + response.data;
      if (response.data === 0 && isSurvivalMode === "true") {
        setIsLose(1);
      }
      setScore(score_new);
      localStorage.setItem("score", score_new);
    } catch (error) {
      toast.error(
        `Failed in submitting answer: \n${error.respond.data.message}`
      );
      console.log(handleError(error));
    }
  };

  useEffect(() => {
    if (!isAnswerSubmitted) {
      const interval = setInterval(() => {
        setRoundTime((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1;
          if (newTimeLeft <= 0) {
            clearInterval(interval);
            if(selectedCityName==null) {
              submitAnswer("no answer", totalTime);
              setSelectedCityName("noAnswer");
            }
            else {
              submitAnswer(selectedCityName, totalTime);
              setSelectedCityName(selectedCityName)
            }
          }
          return newTimeLeft;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isAnswerSubmitted, selectedCityName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAnswerSubmitted) {
      submitAnswer(selectedCityName, totalTime - roundTime);
    } else {
      endRound();
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
      toast.info(`Image refreshed.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  }

  const handleExitButtonClick = async () => {
    await api.delete(`games/${gameId}`);
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("score");
    localStorage.removeItem("isSurvivalMode");
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    history.push("/home");
  };

  return (
    <div className="page-container">
      <div className="guess-the-city">
        <div style={{ position: "fixed", top: 150, left: 75 }}>
          <Button
            style={{ fontSize: "30px", height: "60px", width: "100%" }}
            onClick={handleExitButtonClick}
          >
            Exit Game
          </Button>
        </div>
        <div className="disclaimer">Please do not leave during the game!</div>
        <div className="guess-the-city main">
          <Container>
            <Grid container spacing={4}>
              <Grid item md={6}>
                <div className="city-image-refresh">
                  <button
                    className="city-image-refresh-button"
                    onClick={refreshImage}
                  >
                    <AutorenewIcon fontSize="large" />
                  </button>
                </div>
                <div style={{ alignItems: "center", display: "block" }}>
                  <img className="city-image" alt="GuessImg" src={imageUrl} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p>
                    Your Score: {score}{" "}
                    {isSurvivalMode === "true" ? "(Survival Mode)" : ""}
                  </p>
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
                    <button type="submit" 
                      className="submit-button"
                      disabled={selectedCityName==null}>
                      {isAnswerSubmitted ? "Next" : "Submit Answer"}
                    </button>
                  </form>
                </div>
              </Grid>
            </Grid>
          </Container>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default SingleGamePage;
