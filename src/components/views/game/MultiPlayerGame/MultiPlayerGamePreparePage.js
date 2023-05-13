import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from "react-switch";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "styles/views/game/GamePrepare.scss";


const UrgeWithPleasureComponent = ({ duration }) => (
  <CountdownCircleTimer
    isPlaying
    duration={duration}
    colors={['#1979B8 ', '#F7B801', '#A30000']}
    colorsTime={[10, 5, 0]}
    size={200}
    strokeWidth={20}
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
);

const RoundCountdown = () => {
  // use react-router-dom's hook to access the history
  const [roundNumber, setRoundNumber] = useState(
  localStorage.getItem("roundNumber")
  );
  const [score, setScore] = useState(localStorage.getItem("playerScore"));
  const history = useHistory();
  const [duration, setDuration] = useState(555555555555);
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [intervalId, setIntervalId] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [previousRoundData, setPreviousRoundData] = useState([]);

  const gameId = localStorage.getItem("gameId");

  const getGameInfo = async () => {
    const response = await api.get(`/games/${localStorage.getItem("gameId")}/`);

    var currentRound = response.data.currentRound;
    // input User Ranking when implemented
  };

  const endGame = async (gameId) => {
    try {
      const response = await api.get(`/games/${gameId}/results`);
      console.log('Game result:', response.data);
      // Do something with the response, e.g. update state or redirect to a new page
    } catch (error) {
//      console.error('Error getting game result:', error);
        toast.error("Failed in getting game result!");
        console.log(handleError(error));
    }
    history.push(`/GameFinishPage/`);
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
//    if(secondsLeft===8){
//      getGameDetails(gameId);
//    }

    if (secondsLeft === 0) {
      clearInterval(secondsLeft);
      clearInterval(intervalId);
      setTimeout(() => {
        history.push(`/MultiGamePage/${gameId}`);
      }, 500);
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
        if (roundNumber === 1) {
          setPreviousRoundData(leaderboardData);
          console.log("Previous round data", leaderboardData)
        }

        setTimeout(() => {
          setLeaderboardData(response.data)
          console.log("this is what i want", response)
          console.log(response.data);
        }, 500);
      } catch (error) {
//        console.error(
//          `An error occurs while fetching the users: \n${handleError(error)}`
//        );
//        console.error("Details:", error);
//        alert("Something went wrong while fetching the users!");
        toast.error("Something went wrong while fetching the users!");
        console.log(handleError(error));
      }
    }
    fetchData();
  }, [leaderboardData]);

  const handleExitButtonClick = () => {
    history.push("/Home");
  };

  const handleSub = async () => {
    console.log(localStorage.getItem("gameId"));
    const response2 = await api.get(
      `/games/${localStorage.getItem("gameId")}/players`
    );
    console.log("this is what i want", response2);
  };

  const totalRounds = localStorage.getItem("totalRounds")
  const username = localStorage.getItem("username")

  console.log("total: ",totalRounds, "roundNumber:",roundNumber);
  if (roundNumber > totalRounds) {
    endGame(gameId);}

  const calculateRowPosition = (currentRank, previousRank) => {
    const position = currentRank - previousRank;
    return position * 100 + '%';
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
          className="roundcountdown container_left"
          id="information-container"
        >
          <div style={{ fontSize: "40px" }}>
            {/* Replace 2 with {currentRound+1} and 5 with {roundNumber}*/}
            Round {roundNumber} of {totalRounds} is starting soon...
          </div>
        </InformationContainer>
        <div className="roundcountdown layout" style={{ display: "flex", flexDirection: "row" }}>
          <InformationContainer
            className="roundcountdown leaderboard-container"
            id="information-container"
          >
            <div className="leaderboard">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => {
                    const previousRank = roundNumber > 1 ? previousRoundData.find((data) => data.playerName === entry.playerName)?.rank : entry.rank;
                    const position = calculateRowPosition(entry.rank, previousRank);

                    return (
                      <tr
                        key={entry.id}
                        style={{
                          transform: `translateY(${position})`,
                          backgroundColor: entry.playerName === username ? 'rgba(200, 0, 0, 0.5)' : 'rgba(128, 128, 128, 0.5)',
                         }}
                      >
                        <td>{entry.rank}</td>
                        <td>{entry.playerName}</td>
                        <td>{entry.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </InformationContainer>
          <div></div>
          <div></div>
          <div></div>
           <InformationContainer
             className="roundcountdown container_right"
             id="information-container"
           >
           <div className="countdown-text">
             <UrgeWithPleasureComponent duration={duration} />
           </div>
           </InformationContainer>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default RoundCountdown;
