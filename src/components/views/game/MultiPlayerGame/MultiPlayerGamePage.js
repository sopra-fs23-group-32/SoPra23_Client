import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { Grid, Container } from "@mui/material";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/views/game/GamePage.scss";

const MultiPlayerGamePage = () => {
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(localStorage.getItem("myScore"));
  const [roundTime, setRoundTime] = useState(
    localStorage.getItem("countdownTime")
  );
  const [roundTime2, setRoundTime2] = useState(3);
  const [selectedCityName, setSelectedCityName] = useState(null);
  // control the flow
  const [isWaiting, setIsWaiting] = useState(true);
  const [imageUrl, setImageUrl] = useState(localStorage.getItem("PictureUrl"));
  const [isLose, setIsLose] = useState(false);

  const gameId = localStorage.getItem("gameId");
  const isSurvivalMode = localStorage.getItem("isSurvivalMode");
  const roundNumber = localStorage.getItem("roundNumber");
  const totalRounds = localStorage.getItem("totalRounds");
  const totalTime = localStorage.getItem("countdownTime");
  const cityNames = JSON.parse(localStorage.getItem("citynames"));
  const correctOption = localStorage.getItem("CorrectOption");
  const playerId = localStorage.getItem("userId");
  // const isServer = localStorage.getItem("isServer");
  const history = useHistory();

  const endRound = () => {
    console.log("Lose", isLose);
    if (isLose) {
      history.push(`/MultiGamePage/${gameId}/GameFinish`);
    }
    else if (roundNumber===totalRounds) {
      history.push(`/MultiGamePage/${gameId}/GameFinish`);
    }
    else {
      localStorage.setItem("roundNumber", Number(roundNumber) + 1);
      history.push(`/MultiGamePage/${gameId}/RoundCountPage`);
    }
  };

  const submitAnswer = async (cityName, time) => {
    setIsAnswerSubmitted(true);
    try {
      const response = await api.post(
        `/games/${gameId}/players/${playerId}/answers`,
        { answer: cityName, timeTaken: time }
      );
      const score_new = parseInt(score) + response.data;
      if(response.data===0 && isSurvivalMode==="true") {
        setIsLose(true);
      }
      setScore(score_new);
      localStorage.setItem("myScore", score_new);
    } catch (error) {
      toast.error( `Failed in submitting answer: \n${error.respond.data.message}`);
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
  
  // handle msg from the web socket
  useEffect(() => {
    let subscription;
    const Socket = new SockJS(getDomain() + "/socket");
    const stompClient = Stomp.over(Socket);
    stompClient.connect(
      {},
      (frame) => {
        subscription = stompClient.subscribe(
          `/instance/games/${gameId}`,
          async (message) => {
            const messagBody = JSON.parse(message.body);
            console.log("Socket mssage: ", messagBody.type);
            if (messagBody.type === WebSocketType.ALL_ANSWER) {
              setIsWaiting(false);
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

  // when all answered(not waiting) count 3s and go to next page
  useEffect(() => {
    if(!isWaiting){
      const interval = setInterval(() => {
        setRoundTime2((prevTimeLeft) => {
          const newTimeLeft = prevTimeLeft - 1;
          if (newTimeLeft <= 0) { endRound(); }
          return newTimeLeft;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isWaiting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAnswerSubmitted) {
      submitAnswer(selectedCityName, totalTime - roundTime);
      if (isWaiting) {
        toast.info(`Waiting for other players to answer...`);
      }
    }
  };

  async function refreshImage() {
    try {
      const response = await api.put(`games/${gameId}/refresh`);
      setImageUrl(response.data);
      console.log("New Image URL.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info(`Image refreshed.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  }

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

  const handleExitButtonClick = async () => {
    await api.delete(`games/${gameId}/players/${playerId}`);
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("myScore");
    // localStorage.removeItem("isServer");
    localStorage.removeItem("isSurvivalMode");
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    history.push("/home");
  };

  const submitButtonContent = isAnswerSubmitted ? 
    isWaiting ? 
      "Waiting for others" : `Wait ${roundTime2} sec`
    : "Submit Answer";

  return (
  <div className="page-container">
    <div className="guess-the-city">
      <div style={{ position: "fixed", top: 75, left: 75 }}>
        <Button style={{ fontSize: "30px", height: "60px", width: "100%" }}
         onClick={handleExitButtonClick}>
          Exit Game
        </Button>
      </div>
      <div className="disclaimer">Please do not close the page during the game!</div>
        <div className="guess-the-city main">
          <Container>
            <Grid container spacing={4}>
              <Grid item md={6}>
                <div className="city-image-refresh">
                  <button
                    className="city-image-refresh-button"
                    onClick={() => refreshImage()}
                  >
                    <AutorenewIcon fontSize="large" />
                </button>
              </div>
              <div>
                <img className="city-image" alt="GuessImg" src={imageUrl}/>
              </div>
              <div style={{ textAlign: "center" }}>
                <p>Your Score: {score} {isSurvivalMode==="true"? "(Survival Mode)":""}</p>
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
                  <button type="submit" className="submit-button" disabled={isAnswerSubmitted || selectedCityName==null}>
                  {submitButtonContent}
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

export default MultiPlayerGamePage;
