import React, { useEffect } from "react";
import { api } from "helpers/api";
import { useState } from "react";
import { useHistory } from "react-router-dom";

import { Button } from "components/ui/Button";

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Container,
} from "@mui/material";

import "styles/views/home/Join.scss";

const JoinGamePage = () => {
    const history = useHistory();
    const [openServers, setOpenServers] = useState([]);

    useEffect(() => {
        const fetchGamedata = async () => {
            const gameInfosResponse = await api.get("/games/");
            const gameInfos = gameInfosResponse.data;
            setOpenServers(gameInfos);
        };
        fetchGamedata();
    }, []);

    const joinServer = async serverInfo => {
        // fetchQuestions(serverInfo);
        localStorage.setItem("score", 0);
        localStorage.setItem("gameId", serverInfo.gameId);
        localStorage.setItem("totalRounds", serverInfo.gameRounds);
        localStorage.setItem("roundNumber", 0);
        localStorage.setItem("category", serverInfo.category);
        localStorage.setItem("gamePlayer", serverInfo.playerNum)
        localStorage.setItem("isServer", 0);
        
        history.push("/StartGamePage");
    }

    return (
        <Container className="joinboard container">
            <div className="headerrow">
                <h2>Join the Server</h2>
            </div>
            <div className="joinboard field">
                <div className="sever-field">
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
                                        Category
                                    </TableCell>
                                    <TableCell align="center">
                                        Rounds
                                    </TableCell>
                                    <TableCell align="center">Join</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {openServers.map((openServer, index) => {
                                    return (
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
                                                {index + 1}.
                                            </TableCell>
                                            <TableCell align="center">
                                                {openServer.category}
                                            </TableCell>
                                            <TableCell align="center">
                                                {openServer.gameRounds}
                                            </TableCell>
                                            <TableCell align="center">
                                                <p onClick={() => joinServer(openServer)}>Join</p>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
                <div className="button-container">
                    <Button width="30%" onClick={() => history.push("/home")}>
                        Return to home
                    </Button>
                    <Button width="30%" onClick={() => history.push("/lobby")}>
                        Create Server
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default JoinGamePage;
