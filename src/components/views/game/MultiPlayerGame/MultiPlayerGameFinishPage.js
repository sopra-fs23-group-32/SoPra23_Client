import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { Table, TableBody, TableCell, TableHead, TableRow,} from "@mui/material";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "styles/views/game/FinalPage.scss";

const MultiPlayerGameFinishPage = () => {
  const [playerRanking, setPlayerRanking] = useState([]);
  const playerId = localStorage.getItem("userId");
  const gameId = localStorage.getItem("gameId");
  const isHost = localStorage.getItem("isServer");
  const history = useHistory();

  const saveGameHistory = async () => {
    const response = await api.post(`/users/${playerId}/gameHistories/${gameId}`);
    console.log("gamehistory", response.data);
    toast.info(`Player's game history saved.`);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  useEffect(() => {
    const Socket = new SockJS(getDomain() + "/socket");
    const stompClient = Stomp.over(Socket);
    let subscription;
    stompClient.connect(
      {},
      (frame) => {
        console.log("Socket connected!");
        console.log(frame);
        subscription = stompClient.subscribe(
          `/instance/games/${gameId}`,
          (message) => {
            const messagBody = JSON.parse(message.body);
            if (messagBody.type===WebSocketType.GAME_END) {
              saveGameHistory();
            }
          }
        );
      },
      (err) => console.log(err)
    );
    return () => { subscription.unsubscribe();};
  }, []);

  useEffect(() => {
    async function SaveGameAndFetchRanking() {
      try {
        if (isHost === true) {
          const responseGameInfo = await api.post(`/gameInfo/${gameId}`);
          console.log(responseGameInfo.data);
          toast.info(`Game's information saved.`);
        }
        // get the final ranking
        const responseRanking = await api.get(`/games/${gameId}/ranking`);
        // Get the returned users and update the state.
        setPlayerRanking(responseRanking.data);
        console.log("player", responseRanking.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      catch (error) {
        toast.error("Something went wrong while fetching the ranking!");
        console.log(handleError(error));
      }
    };
    SaveGameAndFetchRanking();
  }, []);

  const groupedPlayers = playerRanking.reduce((groups, player) => {
    const { rank, playerName } = player;
    if (!groups[rank]) { groups[rank] = []; }
    groups[rank].push(playerName);
    return groups;
  }, {});

  const endGame = async() => {
    if (isHost===1){
      await api.delete(`games/${gameId}`);
    }
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("myScore");
    localStorage.removeItem("isServer");
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    history.push("/home");
  };

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
