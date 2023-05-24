import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import Switch from "react-switch";
import InformationContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";
import { InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "styles/views/game/Lobby.scss";

const Lobby = () => {
  // basic settings
  const [selectedCategory, setSelectedCategory] = useState("EUROPE");
  const [gameRounds, setGameRounds] = useState(1);
  const [countdownTime, setCountdownTime] = useState(15);
  // for UI
  const [isLoadingGame, setIsLoadingGame] = useState(false);
  // for Survival Mode
  const [isSurvivalMode, setIsSurvivalMode] = useState(false);

  const userId = localStorage.getItem("userId");
  const history = useHistory();

  const handleAddPlayer = async (gameId) => {
    try {
      const response = await api.post(`/games/${gameId}/players/${userId}`);
      console.log("Player added:", response.data);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  const startGameSingleplayer = async (category, gameRounds, gameDuration) => {
    if (gameRounds === 0) {
      toast.error("The rounds should not be less than 1");
    }
    if (isSurvivalMode) {
      gameRounds = 10000;
    }
    try {
      localStorage.setItem("category", category);
      localStorage.setItem("totalRounds", gameRounds);
      localStorage.setItem("countdownTime", gameDuration);
      localStorage.setItem("isSurvivalMode", isSurvivalMode);
      const requestBody = {
        category: category,
        totalRounds: gameRounds,
        countdownTime: gameDuration,
      };
      const response = await api.post("/games", requestBody);
      const gameId = response.data.gameId;
      localStorage.setItem("gameId", gameId);
      handleAddPlayer(gameId);
      console.log("SinglePlayer Game created: ", response.data);

      localStorage.setItem("roundNumber", 1);
      localStorage.setItem("score", 0);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      history.push(`/SinglegamePage/${gameId}/RoundCountPage`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  return (
    <div className="page-container">
      <div className="lobby container" style={{ flexDirection: "column" }}>
        <div className="lobby layout">
          <InformationContainer className="lobby container_left">
            <h2>Singleplayer Settings</h2>
            <div className="lobby category-select">
              <InputLabel
                className="lobby label"
                style={{ paddingLeft: "1px" }}
              >
                Category:
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCategory}
                label="category"
                style={{ height: "45px", marginLeft: "5px", width: "150px" }}
                onChange={(e) => setSelectedCategory(e.target.value)}
                inputProps={{
                  MenuProps: {
                    sx: { borderRadius: "10px" },
                    MenuListProps: {
                      sx: { backgroundColor: "#1979b8", color: "white" },
                    },
                  },
                }}
                className="lobby category"
              >
                {/* <MenuItem value={"WORLD"}>World</MenuItem> */}
                <MenuItem value={"EUROPE"}>Europe</MenuItem>
                <MenuItem value={"ASIA"}>Asia</MenuItem>
                <MenuItem value={"NORTH_AMERICA"}>North America</MenuItem>
                <MenuItem value={"SOUTH_AMERICA"}>South America</MenuItem>
                <MenuItem value={"AFRICA"}>Africa</MenuItem>
                <MenuItem value={"WORLD"}>World</MenuItem>
              </Select>
            </div>
            <div className="lobby category-select">
              <InputLabel className="lobby label">Survival Mode:</InputLabel>
              <div className="survival-switch">
                <Switch
                  checked={isSurvivalMode}
                  onChange={() => setIsSurvivalMode(!isSurvivalMode)}
                  offColor="#000000"
                  onColor="#1979b8"
                  checkedIcon={false}
                  uncheckedIcon={false}
                />
              </div>
            </div>
            <div className="lobby category-select">
              <InputLabel
                className="lobby label"
                style={{ paddingLeft: "1px" }}
              >
                Rounds:
              </InputLabel>
              <TextField
                className="lobby round"
                style={{ width: "150px" }}
                inputProps={{
                  style: { textAlign: "center", height: "10px" },
                  min: 1,
                  type: "number",
                }}
                disabled={isSurvivalMode}
                value={gameRounds}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value > 0 && value < 1001 && /^\d+$/.test(value)) {
                    setGameRounds(value);
                  } else {
                    toast.warning(
                      "You can only set the game's total round in range [1, 1000]."
                    );
                    setGameRounds(1);
                  }
                }}
              />
            </div>
            <div className="lobby category-select">
              <InputLabel
                className="lobby label"
                style={{ paddingLeft: "1px" }}
              >
                Time Limit:
              </InputLabel>
              <TextField
                className="lobby round"
                style={{ width: "150px" }}
                inputProps={{
                  style: { textAlign: "center", height: "10px" },
                  min: 15,
                  type: "number",
                }}
                value={countdownTime}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value > 11 && value < 60 && /^\d+$/.test(value)) {
                    setCountdownTime(value);
                  } else {
                    toast.warning(
                      "You can only set the game's countdown time in range [12, 59] sec."
                    );
                    setCountdownTime(15);
                  }
                }}
              />
            </div>
            <div className="lobby button-container">
              <div>
                {isLoadingGame ? (
                  <Spinner />
                ) : (
                  <Button
                    style={{ display: "inline-block", margin: "auto" }}
                    onClick={() => {
                      setIsLoadingGame(true);
                      startGameSingleplayer(
                        selectedCategory,
                        gameRounds,
                        countdownTime
                      );
                    }}
                  >
                    Start Game
                  </Button>
                )}
              </div>
              <Button
                style={{ display: "inline-block", margin: "0 10px" }}
                onClick={() => history.push("/home")}
              >
                Back to Home Page
              </Button>
            </div>
          </InformationContainer>
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Lobby;
