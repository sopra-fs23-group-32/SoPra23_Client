import React, { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import {Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Container,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "styles/views/game/JoinGame.scss";

const JoinGame = () => {
  const [openingGames, setOpeningGames] = useState([]);
  const userId = localStorage.getItem("userId");
  
  const history = useHistory();

  useEffect(() => {
    const fetchGamedata = async () => {
      const response = await api.get("/games/");
      setOpeningGames(response.data);
      console.log(response)
    };
    fetchGamedata();
  }, []);

<<<<<<< HEAD:src/components/views/game/MultiPlayerGame/JoinGame.js
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
=======
  const handleAddPlayer = async (gameID) => {
    try {
      const response = await api.post(`/games/${gameID}/players/${userId}`);
      console.log("You Joined the game", response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e:src/components/views/game/JoinGame.js
    }
    catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

<<<<<<< HEAD:src/components/views/game/MultiPlayerGame/JoinGame.js
    return (
        <Container className="joinboard container">
            <div className="headerrow">
                <h2>Join a Multiplayer Game</h2>
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
                                        Region
                                    </TableCell>
                                    <TableCell align="center">
                                        Number of Rounds
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
                    <Button width="30%" onClick={() => history.push("/lobby/multiplayer")}>
                        Create a Multiplayer Game
                    </Button>
                </div>
            </div>
        </Container>
    );
=======
  const joinServer = async (game) => {
    localStorage.setItem("isServer", 0);
    localStorage.setItem("gameId", game.gameId);
    localStorage.setItem("category", game.category);
    localStorage.setItem("totalRounds", game.totalRounds);
    localStorage.setItem("countdownTime", game.countdownTime);
    localStorage.setItem("playerNum", game.currentPlayerNum);
    handleAddPlayer(game.gameId);
    history.push("/StartGamePage");
  };

  return (
    <div>
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
            <Table sx={{ minWidth: 650 }}
              aria-label="simple table"
              className="score-table"
            >
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Rounds</TableCell>
                  <TableCell align="center">Join</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {openingGames.map((openingGame, index) => {
                  return (
                    <TableRow key={index}
                      sx={{ "&:last-child td, &:last-child th": {border: 0,},}}
                    >
                      <TableCell component="th" scope="row">
                        {openingGame.gameId}.
                      </TableCell>
                      <TableCell align="center">
                        {openingGame.category}
                      </TableCell>
                      <TableCell align="center">
                        {openingGame.gameRounds}
                      </TableCell>
                      <TableCell align="center">
                        {openingGame.currentPlayerNum}
                      </TableCell>
                      <TableCell align="center">
                        <p onClick={() => joinServer(openingGame)}>Join</p>
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
            Return to Lobby
          </Button>
        </div>
      </div>
    </Container>
    <ToastContainer />
    </div>
  );
>>>>>>> d7dc155fcc2078ba4502daa39675f8aec011b33e:src/components/views/game/JoinGame.js
};

export default JoinGame;
