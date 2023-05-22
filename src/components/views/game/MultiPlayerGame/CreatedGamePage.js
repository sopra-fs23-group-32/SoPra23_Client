import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import InformationContainer from "components/ui/BaseContainer";
import { InputLabel, Select, MenuItem, TextField,} from "@mui/material";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";

import { ToastContainer, toast } from 'react-toastify';
import "styles/views/game/WaitingPage.scss";

const CreatedGamePage = () => {
  const [gamePlayers, setGamePlayers] = useState([]);
  const [playerNumber, setPlayerNumber] = useState(localStorage.getItem("playerNum"));
  // 
  const gameId = localStorage.getItem("gameId");
  const category = localStorage.getItem("category");
  const totalRounds = localStorage.getItem("totalRounds");
  const totalTime = localStorage.getItem("countdownTime");
  const isServer = localStorage.getItem("isServer");

  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");
  const history = useHistory();

  async function fetchPlayer() {
    try{
      const response = await api.get(`/games/${localStorage.getItem("gameId")}/players`);
      console.log("Players", response.data);
      setGamePlayers(response.data);
      setPlayerNumber(response.data.length);
    }
    catch (error) {
      toast.error(`Failed to fetch player in game(ID ${gameId})\n
        ${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  // automatically fetch player list
  useEffect(() => {
    toast.info(`Successfully add player '${username}'(ID ${userId}) to game(ID ${gameId})!`)
    fetchPlayer();
  }, []);

  useEffect(() => {
    const Socket = new SockJS(getDomain() + "/socket");
    const stompClient = Stomp.over(Socket);
    let subscription;
    stompClient.connect(
      {},
      (frame) => {
        subscription = stompClient.subscribe(
          `/instance/games/${gameId}`,
          (message) => {
            const messagBody = JSON.parse(message.body);
            console.log("Socket receive msg: ", messagBody);
            if (messagBody.type===WebSocketType.PLAYER_ADD ||
              messagBody.type===WebSocketType.PLAYER_REMOVE) {
              fetchPlayer();
            }
            else if (!isServer && messagBody.type===WebSocketType.GAME_START) {
              localStorage.setItem("myScore", 0);
              localStorage.setItem("roundNumber", 1);
              history.push(`/MultiGamePage/${gameId}/RoundCountPage/`);
            }
            else if (!isServer && messagBody.type===WebSocketType.GAME_END) {
              localStorage.removeItem("gameId");
              localStorage.removeItem("category");
              localStorage.removeItem("totalRounds");
              localStorage.removeItem("countdownTime");
              localStorage.removeItem("playerNum");
              localStorage.removeItem("isServer");
              toast.warning("The host player has deleted this game.")
              history.push(`/home`);
            }
          }
        );
      },
      (err) => console.log(err)
    );
    return () => { subscription.unsubscribe();};
  }, []);

  const leaveGame = async () => {
    if (isServer === 1) {
      const response = await api.delete(`/games/${gameId}`);
      console.log("Delete game:", response.data);
    }
    else {
      const response = await api.delete(`/games/${gameId}/players/${userId}`);
      console.log("Delete player:", response.data);
    }
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("playerNum");
    localStorage.removeItem("isServer");
  };

  const backToLobby = () => {
    leaveGame(); history.push("/JoinGame");
  };
  const backToHome = () => {
    leaveGame(); history.push("/home");
  };

  const startGameMultiplayer = async (gameId) => {
    localStorage.setItem("myScore", 0);
    localStorage.setItem("roundNumber", 1);
    history.push(`/MultiGamePage/${gameId}/RoundCountPage/`);
  };

  const Player = ({players}) => (
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
  )
  Player.propTypes = {
    players: PropTypes.object,
  };
  let playerList = <Spinner />

  if (gamePlayers !== null) {
    playerList = (
      <Player players={gamePlayers} />
    );
  }

  return (
    <div className="waiting-page layout">
      <InformationContainer className="waiting-page container_left">
        <div style={{ fontSize: "40px", textAlign: "center" }}>
          Game Settings
        </div>
        <div className="waiting-page select">
          
          <InputLabel className="waiting-page label">Category:</InputLabel>
          <Select value={category} disabled
          style={{ height: '45px', marginLeft: '5px', width:"200px" }}
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
            <MenuItem value={"OCEANIA"}>Oceania</MenuItem>
            <MenuItem value={"WORLD"}>World</MenuItem>
          </Select>
        </div>
        <div className="waiting-page select">
          <InputLabel className="waiting-page label">Rounds:</InputLabel>
          <TextField className="waiting-page text"
            inputProps={{
              style: { textAlign: "center", height: "10px"}
            }}
            value={totalRounds} disabled 
          />
        </div>
        <div className="waiting-page select">
        <InputLabel className="waiting-page label">Countdown Time:</InputLabel>
        <TextField className="waiting-page text"
          inputProps={{
            style: { textAlign: "center", height: "10px"},
          }}
          value={totalTime} disabled 
        />
        </div>
        <div style={{flexDirection:"column"}}>
          {playerNumber<2 && (
          <div style={{textAlign: "center"}}>
          You can't start a multiplayer game by yourself!
            
          </div>
)}


        <div className="waiting-page button-container" style={{marginTop: "10px"}}>
          <Button onClick={() => startGameMultiplayer(gameId)}
            disabled={!isServer||playerNumber<2}>
            Start Game
          </Button>
        </div>
        </div>
        <div className="waiting-page button-container">
          <Button onClick={() => backToLobby()}>
            Back to Lobby
          </Button>
          <Button onClick={() => backToHome()}>
            Back to Home Page
          </Button>
        </div>
      </InformationContainer>

      <InformationContainer className="waiting-page container_right">
        <p style={{ fontSize: "30px", marginBottom: "20px" }}>
            {playerNumber} {playerNumber === 1 ? "player is" : "players are"} in the lobby:
        </p>
        <div>{playerList}</div>
      </InformationContainer>
    </div>
  );
};

export default CreatedGamePage;
