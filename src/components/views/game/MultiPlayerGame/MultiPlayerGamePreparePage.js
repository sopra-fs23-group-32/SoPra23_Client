import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import InformationContainer from "components/ui/BaseContainer";
<<<<<<< HEAD
=======
import PropTypes from "prop-types";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e

import "styles/views/game/Lobby.scss";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

<<<<<<< HEAD
const MultiPlayerGamePreparePage = () => {
    // use react-router-dom's hook to access the history

    const [players, setPlayers] = useState([
        { playerName: "123", score: 256, rank: 1 },
=======
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

const MultiModeRoundCountdown = () => {
  // use react-router-dom's hook to access the history
  const duration = 10;
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [intervalId, setIntervalId] = useState(null);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [previousRoundData, setPreviousRoundData] = useState([]);

  const gameId = localStorage.getItem("gameId");
  const category = localStorage.getItem("category");
  const roundNumber = localStorage.getItem("roundNumber");
  const totalRounds = localStorage.getItem("totalRounds");
  const playerId = localStorage.getItem("userId");
  const username = localStorage.getItem("username")
  const score = localStorage.getItem("myScore");

  const history = useHistory();

  const setLocalStorageItems = (question) => {
    const cityNamesString = JSON.stringify([
      question.option1, question.option2, question.option3, question.option4,
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e
    ]);
    const [secondsLeft, setSecondsLeft] = useState(10);
    const [intervalId, setIntervalId] = useState(null);
    const [totalRounds, setTotalRounds] = useState(localStorage.getItem("totalRounds"));

<<<<<<< HEAD
    const history = useHistory();
    const gameId = localStorage.getItem("gameId");
    const roundNumber = localStorage.getItem("roundNumber");

    //Counting Time
    useEffect(() => {
        const intervalId = setInterval(() => {
            setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (secondsLeft == 9) {
            getGameDetails(gameId);
        }

        if (secondsLeft === 0) {
            clearInterval(secondsLeft);
            clearInterval(intervalId);
            setTimeout(() => {
                history.push(`/MultiPlayerGamePage/${gameId}`);
            }, 500);
        }
    }, [secondsLeft, intervalId]);

    //get 1 data
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(
                    `/games/${localStorage.getItem("gameId")}/ranking`
                );
                // Get the returned users and update the state.
                setPlayers(response.data);
                console.log(response.data);
            } catch (error) {
                console.error(
                    `An error occurs while fetching the users: \n${handleError(
                        error
                    )}`
                );
                console.error("Details:", error);
                alert("Something went wrong while fetching the users!");
            }
        }
        fetchData();
    }, []);

    const getGameDetails = async (gameId) => {
        try {
            const response = await api.get(`/games/${gameId}/questions`);
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
        } catch (error) {
            throw error;
        }
    };
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
                        Round {roundNumber} of {totalRounds} is starting soon...
                    </div>
                </InformationContainer>
                <div className="lobby layout" style={{ flexDirection: "row" }}>
                    <InformationContainer
                        className="lobby container_left"
                        id="information-container"
                    >
                        <div className="leader-board">
                            <p>Leaderboard:</p>
                            <TableContainer
                                component={Paper}
                                sx={{ backgroundColor: "transparent" }}
                            >
                                <Table
                                    sx={{ minWidth: 650 }}
                                    aria-label="simple table"
                                    className="score-table"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell></TableCell>
                                            <TableCell align="center">
                                                UserName
                                            </TableCell>
                                            <TableCell align="center">
                                                Score
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {players.map((player, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    "&:last-child td, &:last-child th":
                                                        {
                                                            border: 0,
                                                        },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {player.rank}.
                                                </TableCell>
                                                <TableCell align="center">
                                                    <p>{player.playerName}</p>
                                                </TableCell>
                                                <TableCell align="center">
                                                    {player.score} Points
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <p>You {localStorage.getItem("score")} Pts</p>
                        </div>
                    </InformationContainer>
                    <InformationContainer
                        className="lobby container_left round-down-count"
                        id="information-container"
                    >
                        <div style={{ fontSize: "40px" }}>{secondsLeft}</div>
                    </InformationContainer>
                </div>
            </div>
=======
  async function fetchQuestion(isServer) {
    try {
      let response;
      if(isServer === true) {
        response = await api.put(`games/${gameId}`);
      }
      else {
        response = await api.get(`games/${gameId}/questions`);
      }
      setLocalStorageItems(response.data);
      console.log(response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  }

  useEffect(() => {
    async function fetchRanking() {
      try {
        const response = await api.get(`/games/${gameId}/ranking`);
        // if (roundNumber === 1) {
        //   setPreviousRoundData(leaderboardData);
        //   console.log("Previous round data", leaderboardData)
        // }
        setLeaderboardData(response.data);
        console.log(response);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log(handleError(error));
      }
    };
    // fetch question and save in localstorage
    if (localStorage.getItem("isServer") === 1) {
      fetchQuestion(true);
    }
    // get all players' ranking
    fetchRanking();
    // set a timer
    const intervalId = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);


  // go to next page when time out
  useEffect(() => {
    if (secondsLeft === 0) {
      clearInterval(secondsLeft);
      clearInterval(intervalId);
      setTimeout(() => {
        if(localStorage.getItem("isServer") === 0){
          fetchQuestion(false);
        }
        history.push(`/MultiGamePage/${gameId}`);
      }, 500);
    }
  }, [secondsLeft, intervalId]);

  const calculateRowPosition = (currentRank, previousRank) => {
    const position = currentRank - previousRank;
    return position * 100 + '%';
  };

  const PlayerRanking = ({leaderboardData}) => (
    <table className="leaderboard">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {leaderboardData.map((rankEntry, index) => {
          const previousRank = roundNumber > 1 ? 
            previousRoundData.find((data) => data.playerName === rankEntry.playerName)?.rank
             : rankEntry.rank;
          const position = calculateRowPosition(rankEntry.rank, previousRank);

          return (
            <tr key={rankEntry.id}
              style={{ transform: `translateY(${position})`,
                backgroundColor: rankEntry.playerName === username ? 'rgba(200, 0, 0, 0.5)' : 'rgba(128, 128, 128, 0.5)',}}
            >
              <td>{rankEntry.rank}</td>
              <td>{rankEntry.playerName}</td>
              <td>{rankEntry.score}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  )
  PlayerRanking.propTypes = {
    rankEntry: PropTypes.object,
  };

  let playRankingList = <Spinner />

  if (leaderboardData !== null) {
    playRankingList = (
      <PlayerRanking leaderboardData={leaderboardData} />
    );
  }

  const handleExitButtonClick = async() => {
    await api.delete(`games/${gameId}/players/${playerId}`);
    history.push("/home");
  };

  return (
    <div className="round countdown container">
      <div style={{ position: "fixed", top: 75, left: 75 }}>
        <Button style={{ fontSize: "45px", height: "100px", width: "100%" }}
          onClick={handleExitButtonClick}
        >
          Exit Game
        </Button>
      </div>

      <div className="roundcountdown layout" style={{ dislay: "flex" }}>
        <InformationContainer className="roundcountdown container_left">
          <div style={{ fontSize: "40px" }}>
            Round {roundNumber} of {totalRounds} is starting soon...
          </div>
          <div style={{ fontSize: "30px" }}>
            City Category: {category}, Your Score: {score}
          </div>
        </InformationContainer>

        <div className="roundcountdown layout" style={{ display: "flex", flexDirection: "row" }}>
          <InformationContainer className="roundcountdown leaderboard-container">
            <div>{playRankingList}</div>
          </InformationContainer>

          <InformationContainer className="roundcountdown container_right">
          <div className="countdown-text">
            <UrgeWithPleasureComponent duration={duration} />
          </div>
          </InformationContainer>
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e
        </div>
    );
};
<<<<<<< HEAD
export default MultiPlayerGamePreparePage;
=======
export default MultiModeRoundCountdown;
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e
