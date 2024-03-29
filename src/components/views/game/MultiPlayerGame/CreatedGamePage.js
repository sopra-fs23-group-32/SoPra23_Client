import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import InformationContainer from "components/ui/BaseContainer";
import { InputLabel, Select, MenuItem, TextField } from "@mui/material";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "styles/views/game/WaitingPage.scss";

const CreatedGamePage = () => {
  const [gamePlayers, setGamePlayers] = useState([]);
  const [playerNumber, setPlayerNumber] = useState(
    localStorage.getItem("playerNum")
  );
  
  const gameId = localStorage.getItem("gameId");
  const category = localStorage.getItem("category");
  const totalRounds = localStorage.getItem("totalRounds");
  const totalTime = localStorage.getItem("countdownTime");
  const isServer = localStorage.getItem("isServer");
  const isSurvivalMode = localStorage.getItem("isSurvivalMode");

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const history = useHistory();

  const fetchPlayer = async () => {
    try{
      const response = await api.get(`/games/${localStorage.getItem("gameId")}/players`);
      console.log("Players List: ", response.data);
      setGamePlayers(response.data);
      setPlayerNumber(response.data.length);
    } catch (error) {
      toast.warning(`Failed to fetch player in game(ID ${gameId})`);
      console.log(handleError(error));
    }
  };

  useEffect(() => {
    toast.info(`Successfully add player '${username}'(ID ${userId}) to game(ID ${gameId})!`);
    fetchPlayer();
  }, []);

  useEffect(() => {
    const interval = setInterval(fetchPlayer, 3000);
    return () => clearInterval(interval);
  }, []);

  const startGameMultiplayer = async (gameId) => {
    localStorage.setItem("myScore", 0);
    localStorage.setItem("roundNumber", 1);
    history.push(`/MultiGamePage/${gameId}/RoundCountPage/`);
  };

  useEffect(() => {
    const Socket = new SockJS(getDomain() + "/socket");
    const stompClient = Stomp.over(Socket);
    let subscription;
    stompClient.connect(
      {}, (frame) => {
        subscription = stompClient.subscribe(`/instance/games/${gameId}`, 
          async (message) => {
            const messagBody = JSON.parse(message.body);
            console.log("Socket receive msg: ", messagBody.type);
            if (messagBody.type===WebSocketType.PLAYER_ADD ||
              messagBody.type===WebSocketType.PLAYER_REMOVE) {
              fetchPlayer();
            }
            if(isServer==="false") {
              if(messagBody.type===WebSocketType.GAME_START){
                localStorage.setItem("myScore", 0);
                localStorage.setItem("roundNumber", 1);
                history.push(`/MultiGamePage/${gameId}/RoundCountPage/`);
              }
              else if (messagBody.type===WebSocketType.GAME_DELETED) {
                localStorage.removeItem("gameId");
                localStorage.removeItem("category");
                localStorage.removeItem("totalRounds");
                localStorage.removeItem("countdownTime");
                localStorage.removeItem("playerNum");
                localStorage.removeItem("isServer");
                localStorage.removeItem("isSurvivalMode");
                history.push(`/home`);
              }
            }
          }
        );
      },
      (err) => console.log(err)
    );
    return () => { subscription.unsubscribe();};
  }, []);

  const leaveGame = async () => {
    try{
      if (isServer === "true") {
        await api.delete(`/games/${gameId}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`Game ${gameId} deleted.`);
        toast.info(`Game (ID: ${gameId}) deleted.`);
      }
      else {
        await api.delete(`/games/${gameId}/players/${userId}`);
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(`Player ${userId} deleted from Game ${gameId}`);
      }
    } catch (error) {
      console.log(handleError(error));
    }
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("playerNum");
    localStorage.removeItem("isServer");
    localStorage.removeItem("isSurvivalMode");
  };

  const backToLobby = () => {
    leaveGame();
    history.push("/lobby/multiplayer");
  };
  const backToHome = () => {
    leaveGame();
    history.push("/home");
  };

  const Player = ({ players }) => (
    <div>
      <table className="WaitingPage table-style">
        <thead>
          <tr>
            <th>UserID</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            return (
              <tr key={player.userId}>
                <td>{player.userId}</td>
                <td>{player.username}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
  Player.propTypes = {
    players: PropTypes.arrayOf(PropTypes.object),
  };
  let playerList = <Spinner />;

  if (gamePlayers !== null) {
    playerList = <Player players={gamePlayers} />;
  }

  return (
    <div className="page-container">
    <div className="waiting-page layout">
      <InformationContainer className="waiting-page container_left">
        <div style={{ fontSize: "40px", textAlign: "center" }}>
          <h2>Game Settings</h2>
        </div>
        <div className="waiting-page select">          
          <InputLabel className="waiting-page label">Category:</InputLabel>
          <Select value={category} disabled
          style={{ height: '45px', marginLeft: '5px', width:"40%", backgroundColor: "#5e5df0" }}
            inputProps={{
              MenuProps: {
                sx: {borderRadius: "10px", },
                MenuListProps: {sx: { backgroundColor: "#1979b8",color: "white",},},
              },
            }}
            className="waiting-page category"
          >
            <MenuItem value={"EUROPE"}>Europe</MenuItem>
            <MenuItem value={"ASIA"}>Asia</MenuItem>
            <MenuItem value={"NORTH_AMERICA"}>North America</MenuItem>
            <MenuItem value={"SOUTH_AMERICA"}>South America</MenuItem>
            <MenuItem value={"AFRICA"}>Africa</MenuItem>
          </Select>
        </div>
        <div className="lobby category-select">
          <InputLabel className="lobby label">
            {isSurvivalMode==="true"? "Survival Mode" : "Normal Mode"}
          </InputLabel>
        </div>
        <div className="waiting-page select">
          <InputLabel className="waiting-page label">Rounds:</InputLabel>
          <TextField className="waiting-page text"
            inputProps={{ style: { textAlign: "center", height: "10px",backgroundColor: "#5e5df0",} }}
            value={totalRounds} disabled 
          />
        </div>
        <div className="waiting-page select">
        <InputLabel className="waiting-page label">Time Limit:</InputLabel>
        <TextField className="waiting-page text"
          inputProps={{ style: { textAlign: "center", height: "10px",backgroundColor: "#5e5df0",} }}
          value={totalTime} disabled 
        />
        </div>
        <div style={{ flexDirection: "column" }}>
          {playerNumber < 2 && (
            <div style={{ textAlign: "center" }}>
              You can't start a multiplayer game by yourself!
            </div>
          )}
          {isServer === "false" && (
            <div style={{ textAlign: "center" }}>
              Only the host can start a game.
            </div>
          )}
          {isServer === "true" && (
            <div style={{ textAlign: "center" }}>
              If you leave the game, all players will be kicked out.
            </div>
          )}
          
        </div><div className="center-align">
        <Button  style={{  width:"50%",  }} onClick={() => startGameMultiplayer(gameId)}
            disabled={isServer==="false" || playerNumber<2}
          >
            Start Game
          </Button></div>
        <div className="waiting-page button-container">
          
          <Button onClick={() => backToLobby()}>Back to Lobby</Button>
          <Button onClick={() => backToHome()}>Back to Home Page</Button>
        </div>
        
      </InformationContainer>

      <InformationContainer className="waiting-page container_right">
        <p style={{ fontSize: "30px", marginBottom: "20px",  }}>
            <h2>{playerNumber} {playerNumber === 1 ? "player is" : "players are"} in the lobby:</h2>
        </p>
        <div>{playerList}</div>
      </InformationContainer>
      <ToastContainer />
    </div>
  </div>
  );
};

export default CreatedGamePage;
