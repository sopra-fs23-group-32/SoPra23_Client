import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import {Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow,  Container,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/views/game/JoinGame.scss";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const JoinGame = () => {
  const [openingGames, setOpeningGames] = useState([]);
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const history = useHistory();
  const [buttonClick, setButtonClick] = useState(false);

  useEffect(() => {
    const fetchGamedata = async () => {
      const response = await api.get("/games/");
      setOpeningGames(response.data);
      console.log("All games in SET_UP", response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };
    fetchGamedata();
  }, [buttonClick]);

  const handleButtonClick = () => {
    setButtonClick(!buttonClick);
  };

  const handleAddPlayer = async (gameId) => {
    try {
      const response = await api.post(`/games/${gameId}/players/${userId}`);
      console.log("You Joined the game", response.data);
      toast.info(
        `Successfully add player '${username}'(ID ${userId}) to game(ID ${gameId})!`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
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
    if (game.totalRounds > 1000) {
      localStorage.setItem("isSurvivalMode", true);
    } else {
      localStorage.setItem("isSurvivalMode", false);
    }
    handleAddPlayer(game.gameId);
    history.push("/StartGamePage");
  };

  const convertCityCategory = (category) => {
    // Split the category by underscores
    const words = category.split('_');
  
    // Capitalize each word
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  
    // Join the words with spaces
    const convertedCategory = capitalizedWords.join(' ');
  
    return convertedCategory;
  }


  return (
    <div className="page-container">
      <Container className="joinboard container">
        <div className="align-s">
        <div className="refresh-div">
            <button className="city-image-refresh-button" onClick={handleButtonClick}>
              <AutorenewIcon fontSize="large" />
            </button>
          </div>
          <div className="headerrow">
            <h2>Join Multiplayer Game</h2>
          </div>
          
        </div>
        <div className="joinboard field">
          <div className="sever-field">
            <TableContainer sx={{ backgroundColor: "transparent" }}>
              <Table className="score-table" sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      align="center"
                      style={{ fontSize: "18px", color: "white" }}
                    >
                      HostName
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "18px", color: "white" }}
                    >
                      Category
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "18px", color: "white" }}
                    >
                      Rounds
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "18px", color: "white" }}
                    >
                      Player number
                    </TableCell>
                    <TableCell
                      align="center"
                      style={{ fontSize: "18px", color: "white" }}
                    >
                      Join
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {openingGames.map((openingGame, index) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell
                          align="center"
                          style={{ fontSize: "18px", color: "white" }}
                        >
                          {openingGame.hostname}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ fontSize: "18px", color: "white" }}
                        >
                          {convertCityCategory(openingGame.category)}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ fontSize: "18px", color: "white" }}
                        >
                          {openingGame.totalRounds === 10000
                            ? "SurvivalMode"
                            : openingGame.totalRounds}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ fontSize: "18px", color: "white" }}
                        >
                          {openingGame.playerNum}
                        </TableCell>
                        <TableCell
                          align="center"
                          style={{ fontSize: "18px", color: "white" }}
                        >
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
            <Button
              width="30%"
              onClick={() => history.push("/lobby/multiplayer")}
            >
              Create a Multiplayer Game
            </Button>
          </div>
        </div>
      </Container>
      <ToastContainer />
    </div>
  );
};

export default JoinGame;
