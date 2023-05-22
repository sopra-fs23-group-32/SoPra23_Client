import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";

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

const MultiPlayerGamePreparePage = () => {
    // use react-router-dom's hook to access the history

    const [players, setPlayers] = useState([
        { playerName: "123", score: 256, rank: 1 },
    ]);
    localStorage.setItem("citynames", cityNamesString);
    localStorage.setItem("PictureUrl", question.pictureUrl);
    localStorage.setItem("CorrectOption", question.correctOption);
  };

  async function generateQuestion() {
    try {
      const response = await api.put(`games/${gameId}`);
      setLocalStorageItems(response.data);
      console.log("Generate question: ", response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info(`Question for next round created.`);
    }
    catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  }

  async function fetchQuestion() {
    try {
      const response = await api.get(`games/${gameId}/questions`);
      setLocalStorageItems(response.data);
      console.log("Fetch question: ", response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info(`Got question for next round.`);
    }
    catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  }

  useEffect(() => {
    // fetch question and save in localstorage
    if (isServer==="true") {generateQuestion();}
    async function fetchRanking() {
      try {
        const response = await api.get(`/games/${gameId}/ranking`);
        // if (roundNumber === 1) {
        //   setPreviousRoundData(leaderboardData);
        //   console.log("Previous round data", leaderboardData)
        // }
        setLeaderboardData(response.data);
        console.log("Ranking: ", response.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log(handleError(error));
      }
    }
    
    // get all players' ranking
    fetchRanking();
    // set a timer
    const intervalId = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  
  useEffect(() => {
    if (secondsLeft === 6) {
      
      if(isServer === "false"){
        fetchQuestion();
        
    }
  }}, [secondsLeft]);

  // go to next page when time out
  useEffect(() => {
    if (secondsLeft === 0) {
      clearInterval(secondsLeft);
      clearInterval(intervalId);
      setTimeout(() => {
        
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

          <tr key={rankEntry.playerName}
            style={{ transform: `translateY(${position})`,
              backgroundColor: rankEntry.playerName === username ? 'rgba(200, 0, 0, 0.5)' : 'rgba(128, 128, 128, 0.5)',}}
          >
            <td>{rankEntry.rank}</td>
            <td>{rankEntry.playerName}</td>
            <td>{rankEntry.score}</td>
          </tr>
        })}
      </tbody>
    </table>
  )
  PlayerRanking.propTypes = {
    rankEntry: PropTypes.object,
  };

  let playerRankingList = <Spinner />

  if (leaderboardData !== null) {
    playerRankingList = (
      <PlayerRanking leaderboardData={leaderboardData} />
    );

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
                        Round {roundNumber}{" "}
                        {isSurvivalMode === "true" ? "" : `of ${totalRounds}`}{" "}
                        is starting soon...
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
        </div>
    );
};
export default MultiPlayerGamePreparePage;
