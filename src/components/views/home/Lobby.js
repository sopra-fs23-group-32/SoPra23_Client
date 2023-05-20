import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";
import { InputLabel, Select, MenuItem, TextField } from "@mui/material";
import Switch from "react-switch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "styles/views/home/Lobby.scss";


const Lobby = () => {
  // basic settings
  const [selectedCategory, setSelectedCategory] = useState("EUROPE");
  const [gameRounds, setGameRounds] = useState(1);
  const [countdownTime, setCountdownTime] = useState(15);
  // for Multi Mode
  const [isMultiplayer, setIsMultiplayer] = useState(true);
  const [targetPlayerNumber, setTargetPlayerNumber] = useState(1);
  // for UI
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  const [isLoadingMultiplayerLobby, setIsLoadingMultiplayerLobby] = useState(false);

  const userId = localStorage.getItem("userId");

  // use react-router-dom's hook to access the history
  const history = useHistory();

  const handleToggle = () => {
    setIsMultiplayer(!isMultiplayer);
  };

  const handleAddPlayer = async (gameId) => {
    try {
      const response = await api.post(`/games/${gameId}/players/${userId}`);
      console.log(response);
    }
    catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  const createGame = async (category, gameRounds, gameDuration) => {
    if (gameRounds === 0) {
      toast.error("The rounds should not be less than 1!");
    }
    try {
      let category_uppercase = category.toUpperCase();
      localStorage.setItem("category", category);
      localStorage.setItem("totalRounds", gameRounds);
      localStorage.setItem("countdownTime", gameDuration);
      localStorage.setItem("targetPlayerNumber", targetPlayerNumber);
      localStorage.setItem("targetPlayerNumber", targetPlayerNumber);

      // Create Game
      const requestBody = {category:category_uppercase, totalRounds:gameRounds, countdownTime:gameDuration,};
      const response = (await api.post("/games", requestBody)).data;
      const gameId = response.gameId;
      localStorage.setItem("gameId", gameId);

      handleAddPlayer(gameId);
      localStorage.setItem("score", 0);
      localStorage.setItem("isServer", 1);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      history.push("/StartGamePage");
    }
    catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  const startGameSingleplayer = async (category, gameRounds, gameDuration) => {
    if (gameRounds === 0) {
      toast.error("The rounds should not be less than 1");
    }
    try {
      localStorage.setItem("category", category);
      localStorage.setItem("totalRounds", gameRounds);
      localStorage.setItem("countdownTime", gameDuration);
      localStorage.setItem("roundNumber", 1);

      const requestBody = {category:category, totalRounds:gameRounds, countdownTime:gameDuration,};
      const response = (await api.post("/games", requestBody)).data;
      const gameId = response.gameId;
      localStorage.setItem("gameId", gameId);

      handleAddPlayer(gameId);
      localStorage.setItem("score", 0);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      history.push(`/SinglegamePage/${gameId}/RoundCountPage`);
    }
    catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  return (
    <div className="Lobby container" style={{flexDirection: "column"}}>
      <InformationContainer className="lobby container" style={{fontSize: '48px', width: "fit-content"}}>
        Game Settings
      </InformationContainer>
      <div className="lobby layout">
        <InformationContainer className="lobby container_left">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "10px",}}>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "20px" }}>Singleplayer</span>
            </div>
            <div>
              <Switch
                checked={isMultiplayer}
                onChange={handleToggle}
                offColor="#1979b8"
                onColor="#1979b8"
                checkedIcon={false}
                uncheckedIcon={false}
              />
            </div>
            <div>
              <span style={{ fontSize: "20px" }}>Multiplayer</span>
            </div>
          </div>
          <div className="lobby category-select">
            <InputLabel className="lobby label" style={{paddingLeft:"1px"}}>Category:</InputLabel>
            <Select 
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCategory}
              label="category"
              style={{ height: '45px', marginBottom: '16px', marginLeft: '5px' }}
              onChange={(e) => setSelectedCategory(e.target.value)}
              inputProps={{
                MenuProps: {
                  sx: { borderRadius: "10px", },
                  MenuListProps: {sx: {backgroundColor: "#1979b8", color: "white",},},
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
            <InputLabel className="lobby label" style={{paddingLeft:"1px"}}>Rounds:</InputLabel>
            <TextField
              className="lobby round"
              inputProps={{
                style: { textAlign: "center", height: "10px"},
              }}
              placeholder="enter number of rounds..."
              value={gameRounds}
              onChange={(e) => setGameRounds(e.target.value)}
            />
          </div>
        </InformationContainer>
      </div>

      <div className="lobby button-container">
        {isMultiplayer ? (
          <div>
          {isLoadingMultiplayerLobby ? (<Spinner/>) : (
          <Button style={{ display: "inline-block", margin: "0 10px" }}
            onClick={() => {
              setIsLoadingMultiplayerLobby(true);
              createGame(selectedCategory, gameRounds, countdownTime);
            }}
          >
            Create Game
          </Button>
          )}
          </div>
        ) : (
          <div>
            {isLoadingGame ? (<Spinner />) : (
              <Button style={{ display: "inline-block", margin: "auto" }}
                onClick={() => {
                  setIsLoadingGame(true);
                  startGameSingleplayer(selectedCategory, gameRounds, countdownTime);}
                }
              >
                Start Game
              </Button>
            )}
          </div>
        )};
      </div>

      <div className="lobby button-container">
        <Button style={{ display: "inline-block", margin: "0 10px" }}
          onClick={() => history.push("/JoinGame")}
        >
          Join Multiplayer Game
        </Button>

        <Button style={{ display: "inline-block", margin: "0 10px" }}
          onClick={() => history.push("/home")}
        >
          Back to Home Page
        </Button>
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10px",
          }}
        ></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Lobby;
