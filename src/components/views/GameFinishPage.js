import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

import "styles/views/home/Lobby.scss";


const GameFinishPage = () => {
    const history = useHistory();
    const [players, setPlayers] = useState([]);

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        const saveGameHistory = async () => {
            const response = await api.post(`/gameInfo/${localStorage.getItem("gameId")}`);
            console.log(response.data)
        }
        const saveUserGameHistory = async () => {
            const response = await api.post(`/users/${localStorage.getItem("userId")}/gameHistories/${localStorage.getItem("gameId")}`);
            console.log("gamehistory", response.data);
        }
        const fetchData = async () => {
            try {
                saveGameHistory();
                saveUserGameHistory();
                const response = await api.get(
                    `/games/${localStorage.getItem("gameId")}/ranking`
                );
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Get the returned users and update the state.
                setPlayers(response.data);
                await api.delete(`games/${localStorage.getItem("gameId")}`);
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
    return (
        <div className="round countdown container">
            <div style={{ dislay: "flex" }}>
                <InformationContainer
                    className="lobby container_left"
                    id="information-container"
                >
                    <div style={{ fontSize: "40px" }}>
                        {/* Replace 2 with {currentRound+1} and 5 with {roundNumber}*/}
                        The last round has been played
                    </div>
                </InformationContainer>
                <div>
                    <InformationContainer
                        className="lobby container_left"
                        id="information-container"
                    >
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
                    </InformationContainer>
                    <Button onClick={() => history.push("/home")} style={{ display: "block", margin: "auto", marginTop: "20px" }}>
                        Back to Home Screen
                    </Button>
                </div>
            </div>
        </div>
    );
};
export default GameFinishPage;
