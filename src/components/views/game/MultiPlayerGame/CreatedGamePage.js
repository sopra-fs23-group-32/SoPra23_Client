import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { InputLabel, Select, MenuItem, TextField,} from "@mui/material";

import "styles/views/home/Lobby.scss";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";

const CreatedGamePage = () => {
  const [gamePlayers, setGamePlayers] = useState([]);
  const [playerNumber, setPlayerNumber] = useState(localStorage.getItem("playerNum"));

  const gameId = localStorage.getItem("gameId");
  const category = localStorage.getItem("category");
  const totalRounds = localStorage.getItem("totalRounds");
  const totalTime = localStorage.getItem("countdownTime");
  const userId = localStorage.getItem("userId");
  const isServer = localStorage.getItem("isServer");

  const history = useHistory();

  const fetchPlayer = async () => {
    const response = await api.get(`/games/${localStorage.getItem("gameId")}/players`);
    setGamePlayers(response.data);
    // refresh current player number 
    setPlayerNumber(response.data.length);
  };

  // automatically fetch player list
  useEffect(() => {
    fetchPlayer();
  }, []);

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
            if (messagBody.type === WebSocketType.PLAYER_ADD ||
              messagBody.type === WebSocketType.PLAYRE_REMOVE) {
              fetchPlayer();
            }
            else if (messagBody.type === WebSocketType.ROUND_UPDATE
              && isServer === 0) {
              localStorage.setItem("score", 0);
              localStorage.setItem("roundNumber", 1);
              history.push(`/MultiGamePage/${gameId}/RoundCountPage/`);
            }
          }
        );
      },
      (err) => console.log(err)
    );
    return () => { subscription.unsubscribe();};
  }, []);

  const leaveGame = async () => {
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("playerNum");
    localStorage.removeItem("userId");
    localStorage.removeItem("isServer");
    if (localStorage.isServer === 1) {
      const response = await api.delete(`/games/${gameId}`);
      console.log(response);
    }
    else {
      const response = await api.delete(`/games/${gameId}/players/${userId}`);
      console.log(response);
    }
  };

  const backToLobby = () => {
    leaveGame(); history.push("/JoinGame");
  };
  const backToHome = () => {
    leaveGame(); history.push("/home");
  };

  const startGameMultiplayer = async (gameId) => {
    localStorage.setItem("score", 0);
    localStorage.setItem("roundNumber", 1);
    const response = await api.put(`games/${gameId}`);
    console.log(response);
  };

  return (
    <div className="lobby container">
      <div className="lobby layout">
        <InformationContainer
          className="lobby container_left"
          id="information-container"
        >
          <div style={{ fontSize: "40px", textAlign: "center" }}>
            Game Settings
          </div>
          <div className="lobby category-select">
            <InputLabel className="lobby label">Category</InputLabel>
            <Select value={category} disabled
              label="category"
              inputProps={{
                MenuProps: {
                  sx: {borderRadius: "10px",},
                  MenuListProps: {sx: { backgroundColor: "#1979b8",color: "white",},},
                },
              }}
              className="lobby category"
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
          <div className="lobby category-select">
            <InputLabel className="lobby label">Rounds:</InputLabel>
            <TextField className="lobby round"
              inputProps={{ style: { textAlign: "center" },}}
              value={totalRounds} disabled 
            />
          </div>
          <div className="lobby category-select">
            <InputLabel className="lobby label">Countdown Time:</InputLabel>
            <TextField className="lobby player"
              inputProps={{ style: { textAlign: "center" },}}
              value={totalTime} disabled 
            />
          </div>

          <div className="lobby button-container">
            {isServer === 1 ? (
              <Button onClick={() => startGameMultiplayer(gameId)}>
                Start Game
              </Button>
            ) : null}

            <Button onClick={() => backToLobby()}>
              Back to Lobby
            </Button>
            <Button onClick={() => backToHome()}>
              Back to Home Page
            </Button>
          </div>
        </InformationContainer>

        <InformationContainer className="lobby container_right">
          <p style={{ fontSize: "20px", marginBottom: "20px" }}>
            Users in the lobby:
          </p>
          {gamePlayers.map((player, index) => (
            <p className="lobby player-name" key={index}>
              {player.username}
            </p>
          ))}
        </InformationContainer>
      </div>
    </div>
  );
};

export default CreatedGamePage;
