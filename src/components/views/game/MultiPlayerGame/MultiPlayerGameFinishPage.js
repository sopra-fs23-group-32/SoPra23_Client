import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { Table, TableBody, TableCell, TableHead, TableRow,} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "styles/views/game/FinalPage.scss";

const MultiPlayerGameFinishPage = () => {
  const history = useHistory();
  const [playerRanking, setPlayerRanking] = useState([]);

  const endGame = async () => {
    if (localStorage.getItem("isServer") === 1){
      // games/${localStorage.getItem("gameId")}
      await api.delete(`games/${localStorage.getItem("gameId")}`);
    }
    history.push("/home");
  };

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    const saveGameHistory = async () => {
      // ${localStorage.getItem("gameId")}
      const response = await api.post(`/gameInfo/${localStorage.getItem("gameId")}`);
      console.log(response.data);
    };

    const fetchData = async () => {
      try {
        if (localStorage.getItem("isServer") === 1) {
          saveGameHistory();
        }
        // /users/${localStorage.getItem("userId")}/gameHistories/${localStorage.getItem("gameId")}
        const responseGameInfo = await api.post(
          `/users/${localStorage.getItem("userId")}/gameHistories/${localStorage.getItem("gameId")}`
        );
        console.log("gamehistory", responseGameInfo.data);
        // get the final ranking
        // /games/${localStorage.getItem("gameId")}/ranking
        const responseRanking = await api.get(
          `/games/${localStorage.getItem("gameId")}/ranking`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Get the returned users and update the state.
        setPlayerRanking(responseRanking.data);
        console.log("player", responseRanking.data);
      }
      catch (error) {
//        console.error(`An error occurs while saving the game history:\n${handleError(error)}`);
//        console.error("Details:", error);
//        alert("Something went wrong while saving the game history!");
        toast.error("Something went wrong while saving the game history!");
        console.log(handleError(error));
      }
    };
    fetchData();
  }, []);

  const groupedPlayers = playerRanking.reduce((groups, player) => {
    const { rank, playerName } = player;
    if (!groups[rank]) { groups[rank] = []; }
    groups[rank].push(playerName);
    return groups;
  }, {});


  return (
    <div className="finalpage container">
      <h2 style={{ font: "40px" }}>
        -- Game Ended --
      </h2>

      <div className="podium">
        <div className="third-place">
          <div>3rd</div>
          <div className="player-name">{groupedPlayers[3]}</div>
        </div>
        <div className="first-place">
          <div>1st</div>
          <div className="player-name">{groupedPlayers[1]}</div>
        </div>
        <div className="second-place">
          <div>2nd</div>
          <div className="player-name">{groupedPlayers[2]}</div>
        </div>
      </div>
    
      <Table className="table">
        <TableHead className="th">
          <TableRow>
            <TableCell align="center">Rank</TableCell>
            <TableCell align="center">UserName</TableCell>
            <TableCell align="center">Score</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {playerRanking.map((player, index) => (
            <TableRow className={index % 2 !== 0 ? "tr odd" : "tr even"} key={index}>
              <TableCell className="td" style={{width: "20%"}}>-{player.rank}-</TableCell>
              <TableCell className="td" style={{width: "55%"}}>{player.playerName}</TableCell>
              <TableCell className="td" style={{width: "25%"}}>{player.score} Points</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 style={{ font: "40px" }}>
        You got {localStorage.getItem("score")} Pts
      </h2>
      
      <div className="final button-container">
        <Button onClick={() => endGame()}>
          Back to Home Screen
        </Button>
      </div>
      <ToastContainer />
    </div>
  );

};
export default MultiPlayerGameFinishPage;
