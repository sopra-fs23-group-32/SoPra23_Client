import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from "react-switch";
import PropTypes from "prop-types";

import "styles/views/home/Lobby.scss";

const Players = ({ player }) => <div className="user user-info">Jano</div>;
Players.propTypes = {
  player: PropTypes.object,
};

const RoundCountdown = () => {
  // use react-router-dom's hook to access the history
  const [roundNumber, setRoundNumber] = useState(
    localStorage.getItem("totalRounds")
  );
  const [score, setScore] = useState(localStorage.getItem("playerScore"));
  const history = useHistory();
  const [players, setPlayers] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [intervalId, setIntervalId] = useState(null);

  const gameId = localStorage.getItem("gameId");

  const getGameInfo = async () => {
    const response = await api.get(`/games/${localStorage.getItem("gameId")}/`);

    var currentRound = response.data.currentRound;
    // input User Ranking when implemented
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (secondsLeft === 0) {
      clearInterval(intervalId);
      getGameDetails(gameId);
    }
  }, [secondsLeft, intervalId]);

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
      setTimeout(() => {
        history.push(`/gamePage/${gameId}`);
      }, 1000);
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(
          `/games/${localStorage.getItem("gameId")}/ranking`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Get the returned users and update the state.
        console.log("ranking???");
        setPlayers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(
          `An error occurs while fetching the users: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert("Something went wrong while fetching the users!");
      }
    }
    fetchData();
  }, []);

  const handleExitButtonClick = () => {
    history.push("/Home");
  };

  let playerlist = <Spinner />;
  if (players) {
    playerlist = (
      <ul>
        {players.map((player) => (
          <Players player={player.username} key={player.rank} />
        ))}
      </ul>
    );
  }
  const handleSub = async () => {
    console.log(localStorage.getItem("gameId"));
    const response2 = await api.get(
      `/games/${localStorage.getItem("gameId")}/players`
    );
    console.log("this is what i want", response2);
  };

  return (
    <div className="round countdown container">
      <div style={{ position: "fixed", top: 75, left: 75 }}>
        <Button
          style={{ fontSize: "45px", height: "100px", width: "125%" }}
          onClick={handleExitButtonClick}
        >
          Exit
        </Button>
      </div>
      <div style={{ dislay: "flex" }}>
        <InformationContainer
          className="lobby container_left"
          id="information-container"
        >
          <div style={{ fontSize: "40px" }}>
            {/* Replace 2 with {currentRound+1} and 5 with {roundNumber}*/}
            Round 2 of 5 is starting soon...
          </div>
        </InformationContainer>
        <div className="lobby layout" style={{ flexDirection: "row" }}>
          <InformationContainer
            className="lobby container_left"
            id="information-container"
          >
            Leaderboard:
            {playerlist}
          </InformationContainer>
          <InformationContainer
            className="lobby container_left"
            id="information-container"
          >
            <div style={{ fontSize: "40px" }}>{secondsLeft}</div>
          </InformationContainer>
          <button className="exit-button" onClick={handleSub}>
            {" "}
            getApi{" "}
          </button>
        </div>
      </div>
    </div>
  );
};
export default RoundCountdown;
