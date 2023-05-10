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

import "styles/views/game/FinalPage.scss";

// const PlayerRanking = ({ ranking }) => (
//   <div className="history label">
//     {answer.answer} - {answer.correctAnswer}
//   </div>
// );
// PlayerRanking.propTypes = {
//   ranking: PropTypes.object,
// };

const GameFinishPage = () => {
  const history = useHistory();
  const [playerRanking, setPlayerRanking] = useState([]);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    const saveGameHistory = async () => {
      // ${localStorage.getItem("gameId")}
      const response = await api.post(`/gameInfo/1`);
      console.log(response.data);
    };

    const fetchData = async () => {
      try {
        // saveGameHistory();
        // /users/${localStorage.getItem("userId")}/gameHistories/${localStorage.getItem("gameId")}
        // const responseGameInfo = await api.post(
        //   `/users/2/gameHistories/1}`
        // );
        // console.log("gamehistory", responseGameInfo.data);
        // get the final ranking
        // /games/${localStorage.getItem("gameId")}/ranking
        const responseRanking = await api.get(
          `/games/1/ranking`
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Get the returned users and update the state.
        setPlayerRanking(responseRanking.data);
        console.log("player", responseRanking.data);
      }
      catch (error) {
        console.error(`An error occurs while saving the game history:\n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while saving the game history!");
      }
    };
    fetchData();
  }, []);

  const groupedPlayers = playerRanking.reduce((groups, player) => {
    const { rank, playerName } = player;
    if (!groups[rank]) {
      groups[rank] = [];
    }
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
        <Button style={{ display: "block", margin: "auto", marginTop: "20px" }}
          onClick={() => {
            // games/${localStorage.getItem("gameId")}
            // api.delete(`games/1`);
            history.push("/home");
          }}
        >
          Back to Home Screen
        </Button>
      </div>
      
    </div>
  );

};
export default GameFinishPage;
