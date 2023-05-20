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
  const username = localStorage.getItem("username");
  
  const history = useHistory();

  useEffect(() => {
    const fetchGamedata = async () => {
      const response = await api.get("/games/");
      setOpeningGames(response.data);
      console.log(response)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };
    fetchGamedata();
  }, []);

  const handleAddPlayer = async (gameId) => {
    try {
      const response = await api.post(`/games/${gameId}/players/${userId}`);
      console.log("You Joined the game", response.data);
      toast.info(`Successfully add player '${username}'(ID ${userId}) to game(ID ${gameId})!`)
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  const joinServer = async (game) => {
    localStorage.setItem("gameId", game.gameId);
    localStorage.setItem("category", game.category);
    localStorage.setItem("totalRounds", game.totalRounds);
    localStorage.setItem("countdownTime", game.countdownTime);
    localStorage.setItem("playerNum", game.playerNum);
    localStorage.setItem("isServer", false);
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
          <TableContainer sx={{ backgroundColor: "transparent" }}>
            <Table className="score-table" sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Rounds</TableCell>
                  <TableCell align="center">Player number</TableCell>
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
                        {openingGame.totalRounds}
                      </TableCell>
                      <TableCell align="center">
                        {openingGame.playerNum}
                      </TableCell>
                      <TableCell align="center">
                        <p onClick={() => joinServer(openingGame)}>
                          Join
                        </p>
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
};

export default JoinGame;
