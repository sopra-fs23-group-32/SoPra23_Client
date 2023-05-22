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
    const [secondsLeft, setSecondsLeft] = useState(10);
    const [intervalId, setIntervalId] = useState(null);
    const [totalRounds, setTotalRounds] = useState(
        localStorage.getItem("totalRounds")
    );
    const [isSurvivalMode, setIsSurvivalMode] = useState(
        localStorage.getItem("survival")
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
