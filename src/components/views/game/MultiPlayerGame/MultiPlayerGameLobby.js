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

import "styles/views/game/Lobby.scss";


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

 

  const handleAddPlayer = async (gameId) => {
    try {
      const response = await api.post(`/games/${gameId}/players/${userId}`);
      console.log("Player added:", response.data);
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
      const response = await api.post("/games", requestBody);
      const gameId = response.data.gameId;
      localStorage.setItem("gameId", gameId);
      console.log("Multiplayer Game created: ", response.data)

      handleAddPlayer(gameId);
      localStorage.setItem("isServer", true);
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
      const requestBody = {category:category, totalRounds:gameRounds, countdownTime:gameDuration,};
      const response = await api.post("/games", requestBody);
      const gameId = response.data.gameId;
      localStorage.setItem("gameId", gameId);
      handleAddPlayer(gameId);
      console.log("SinglePlayer Game created: ", response.data)

      localStorage.setItem("roundNumber", 1);
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
        <p>Create Multiplayer Game</p>
      </InformationContainer>
      <div className="lobby layout">
        <InformationContainer className="lobby container_left">
          <div className="lobby category-select">
            <InputLabel className="lobby label" style={{paddingLeft:"1px"}}>Category:</InputLabel>
            <Select 
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedCategory}
              label="category"
              style={{ height: '45px', marginLeft: '5px',width:"150px"}}
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
              style={{width:"150px"}}
              className="lobby round"
              inputProps={{
                style: { textAlign: "center", height: "10px"},
                min:1,
                type:"number",
              }}
              placeholder="enter number..."
              value={gameRounds}
              onChange={(e) => {
                const value = e.target.value;
                if (value > 0 && /^\d+$/.test(value)) {
                  setGameRounds(value);
                } else if (value === "0") {
                  // Handle the case when "0" is entered, you can display an error or show a message
                  // Here, we are resetting the value to an empty string
                  setGameRounds(1);
                }
              }}
            />
            </div>
          <div className="lobby category-select">
        <InputLabel className="lobby label" style={{paddingLeft:"1px"}}>Time Limit:</InputLabel>
        <TextField className="lobby round"
          style={{width:"150px"}}
          inputProps={{
            style: { textAlign: "center", height: "10px"},
            min:15,
            type:"number",
          }}
          placeholder="enter number..."
          value={countdownTime} 
          onChange={(e) => {
            const value = e.target.value;
            if (value > 14 && /^\d+$/.test(value)) {
              setCountdownTime(value);
            } else if (value === "0") {
              // Handle the case when "0" is entered, you can display an error or show a message
              // Here, we are resetting the value to an empty string
              setCountdownTime(15);
            }
          }}
        />
          </div>
          {isMultiplayer && (
          <div style={{textAlign: "center"}}>
          Careful: <br/>
          After creating the multiplayer lobby you won't <br />
          be able to change the 
          game settings anymore! 
            
          </div>
        )}
        </InformationContainer>
      </div>

      <div className="lobby button-container">
        <div>
          {isLoadingGame ? (<Spinner />) : (
            <Button style={{ display: "inline-block", margin: "auto" }}
              onClick={() => {
                setIsLoadingGame(true);
                if(isMultiplayer) {
                  createGame(selectedCategory, gameRounds, countdownTime);
                }
                else {
                  startGameSingleplayer(selectedCategory, gameRounds, countdownTime);
                }
                }
              }
            >
              Start Game
            </Button>
          )}
        </div>
        <Button style={{ display: "inline-block", margin: "0 10px" }}
          onClick={() => history.push("/home")}
        >
          Back to Home Page
        </Button>
      </div>

      <div className="lobby button-container">
        
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
