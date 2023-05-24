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
  const [isEnded, setIsEnded] = useState(false);
  const playerId = localStorage.getItem("userId");
  const gameId = localStorage.getItem("gameId");
  const isServer = localStorage.getItem("isServer");
  const isSurvivalMode = localStorage.getItem("isSurvivalMode");
  const history = useHistory();

  const saveGameHistory = async () => {
    try{
      const response = await api.post(`/users/${playerId}/gameHistories/${gameId}`);
      console.log("Game History: ", response.data);
      toast.info(`Player's game history saved.`);
      //await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      toast.error(`Failed to fetch player in gamexx(ID ${gameId})\n //change this
        ${error.response.data.message}`);
      console.log(handleError(error));
    }
  }
    

  useEffect(() => {
    async function saveGameInfo() {
      try {
        const responseGameInfo = await api.post(`/gameInfo/${gameId}`);
        console.log("Game Info: ", responseGameInfo.data);
        toast.info(`Game's information saved.`);  
      } catch (error) {
        toast.error("Something went wrong while fetching the ranking!");
        console.log(handleError(error));
      }
    }
    async function fetchRanking() {
      try{
        const responseRanking = await api.get(`/games/${gameId}/ranking`);
        setPlayerRanking(responseRanking.data);
        console.log("Ranking: ", responseRanking.data);
      } catch (error) {
        toast.error("Something went wrong while fetching the ranking!");
        console.log(handleError(error));
      }
    }
    if (isServer==="true") {
      saveGameInfo();
    }
    saveGameHistory();
    fetchRanking();
  }, []);

  useEffect(() => {
    let subscription;
    const Socket = new SockJS(getDomain() + "/socket");
    const stompClient = Stomp.over(Socket);
    stompClient.connect(
      {}, (frame) => {
        subscription = stompClient.subscribe(`/instance/games/${gameId}`,
          async (message) => {
            const messagBody = JSON.parse(message.body);
            console.log("Socket mssage: ", messagBody.type);
            if(isServer==="false" && isSurvivalMode==="false" && 
              messagBody.type === WebSocketType.GAME_END){
                setIsEnded(true);
                await api.delete(`games/${gameId}`);
                console.log(`Game ${gameId} deleted.`)
            }
          }
        );
      },
      (err) => console.log(err)
    );
    return () => {subscription.unsubscribe();};
  }, []);

  const groupedPlayers = playerRanking.reduce((groups, player) => {
    const { rank, playerName } = player;
    if (!groups[rank]) { groups[rank] = []; }
    groups[rank].push(playerName);
    return groups;
  }, {});

  const endGame = async() => {
    if (isSurvivalMode==="false"){
      if(isServer==="true") {
        await api.delete(`games/${gameId}`);
        console.log(`Game ${gameId} deleted.`)
      }
    }
    else {
      if(!isEnded) {
        await api.delete(`games/${gameId}/players/${playerId}`);
        console.log(`You leave Game ${gameId}.`)
      }
    }
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("isServer");
    localStorage.removeItem("isSurvivalMode");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("myScore");
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    history.push("/home");
  };

  return (
  <div className="page-container">
    <div className="finalpage container">
      <h2 style={{ font: "40px" }}>
        -- MultiPlayer Game Ended -- <br/>
        {(isSurvivalMode==="true") ? 
        `You survive for ${localStorage.getItem("roundNumber")-1} round(s) in the SurvivalMode`: ""}
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
              <TableCell className="td" style={{ width: "55%" }}>
              {player.playerName === localStorage.getItem("username")
                ? `${player.playerName} (you)`
                : player.playerName}
            </TableCell>
              <TableCell className="td" style={{width: "25%"}}>{player.score} Points</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 style={{ font: "40px" }}>
        You got {localStorage.getItem("myScore")} Pts
      </h2>
      
      <div className="final button-container">
        <Button onClick={() => endGame()}>
          Back to Home Screen
        </Button>
      </div>
      <ToastContainer />
    </div>
    </div>
  );

};
export default MultiPlayerGameFinishPage;
