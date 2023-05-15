import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";

import {
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import Switch from "react-switch";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "styles/views/home/Lobby.scss";
const Lobby = () => {
    const [loading, setLoading] = useState(false);


    const [targetPlayerNumber, setTargetPlayerNumber] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("EUROPE");
    const [isMultiplayer, setIsMultiplayer] = useState(true);
    const [gameRounds, setGameRounds] = useState(1);
    const [countdownTime, setCountdownTime] = useState(10);

    // use react-router-dom's hook to access the history
    const history = useHistory();

    const handleToggle = () => {
        setIsMultiplayer(!isMultiplayer);
    };

    const setLocalStorageItems = (question) => {
        const cityNamesString = JSON.stringify([
            question.option1,
            question.option2,
            question.option3,
            question.option4,
        ]);
        localStorage.setItem("citynames", cityNamesString);
        localStorage.setItem("PictureUrl", question.pictureUrl);
        localStorage.setItem("CorrectOption", question.correctOption);
    };

    const fetchQuestion = async (gameId) => {
        try {
            const response = await api.put(`games/${gameId}`);
            setLocalStorageItems(response.data);
            console.log(response.data);
        } catch (error) {
            throw error;
        }
    };

    const createGame = async (category, gameRounds, gameDuration) => {
        if (gameRounds === 0) {
          toast.error("The rounds should not be less than 1!")
        }
        try {
            let category_uppercase = category.toUpperCase();

            localStorage.setItem("totalRounds", gameRounds);
            localStorage.setItem("gamePlayer", targetPlayerNumber);
            localStorage.setItem("category", selectedCategory);
            localStorage.setItem("roundNumber", 0);
            localStorage.removeItem("citynames2");
            localStorage.removeItem("PictureUrl2");
            localStorage.removeItem("CorrectOption");

            // Create Game
            const requestBody = {
                category: category_uppercase,
                totalRounds: gameRounds,
                countdownTime: gameDuration,
            };
            const response = (await api.post("/games", requestBody)).data;
            localStorage.setItem("gameId", response.gameId);

            const playerID = localStorage.getItem("userId");
            localStorage.setItem("targetPlayerNumber", targetPlayerNumber);

            localStorage.setItem("score", 0);
            handleAddPlayer(playerID);
            localStorage.setItem("isServer", 1);
            history.push("/StartGamePage");
        } catch (error) {
//            alert(`Something went wrong during game start: \n${handleError(error)}`);
              toast.error(`${error.response.data.message}`);
              console.log(handleError(error));
        }
    };

    const startGameSingleplayer = async (
        category,
        gameRounds,
        gameDuration
    ) => {
        if (gameRounds === 0) {
          toast.error("The rounds should not be less than 1")
        }
//        else {}
        try {
            //create gameID
            localStorage.setItem("score", 0);
            localStorage.setItem("category", category);
            localStorage.setItem("totalRounds", gameRounds);
            localStorage.setItem("roundNumber", 1);

            const requestBody = {
                category: category,
                totalRounds: gameRounds,
                countdownTime: gameDuration,
            };
            const response = (await api.post("/games", requestBody)).data;
            const gameId = response.gameId;

            localStorage.setItem("gameId", gameId);
            await fetchQuestion(gameId);
            await handleAddPlayer(localStorage.getItem("userId"));
            setTimeout(() => {
                history.push(`/SinglegamePage/${gameId}/RoundCountPage`);
            }, 1000);
        } catch (error) {
//            alert(`Something went wrong during game start: \n${handleError(error)}`);
              toast.error(`${error.response.data.message}`);
              console.log(handleError(error));
        }
    };

    const startGame = async (category, rounds, time) => {
        setLoading(true);
        await startGameSingleplayer(category, rounds, time);
        setLoading(false);
      };
      
    const handleAddPlayer = async (playerID) => {
        try {
            const gameID = localStorage.getItem("gameId");
            const response = await api.post(
                `/games/${gameID}/players/${playerID}`
            );
        } catch (error) {
//            console.error("Error adding player", error);
            toast.error(`${error.response.data.message}`);
            console.log(handleError(error));
        }
    };

    localStorage.setItem("countdownTime", countdownTime);
    localStorage.setItem("sameCoundownTime", countdownTime);

    return (
        <div className="lobby container">
            <div className="lobby layout">
                <InformationContainer className="lobby container_left">
                    <div style={{ fontSize: "40px" }}>Game Settings</div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            gap: "10px",
                        }}
                    >
                        <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "20px" }}>
                                Singleplayer
                            </span>
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
                            <span style={{ fontSize: "20px" }}>
                                Multiplayer
                            </span>
                        </div>
                    </div>
                    <div className="lobby category-select">
                        <InputLabel className="lobby label">
                            Category
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={selectedCategory}
                            label="category"
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            inputProps={{
                                MenuProps: {
                                    sx: {
                                        borderRadius: "10px",
                                    },
                                    MenuListProps: {
                                        sx: {
                                            backgroundColor: "#1979b8",
                                            color: "white",
                                        },
                                    },
                                },
                            }}
                            className="lobby category"
                        >
                            <MenuItem value={"EUROPE"}>Europe</MenuItem>
                            <MenuItem value={"ASIA"}>Asia</MenuItem>
                            <MenuItem value={"NORTH_AMERICA"}>
                                North America
                            </MenuItem>
                            <MenuItem value={"SOUTH_AMERICA"}>
                                South America
                            </MenuItem>
                            <MenuItem value={"AFRICA"}>Africa</MenuItem>
                            <MenuItem value={"OCEANIA"}>Oceania</MenuItem>
                            <MenuItem value={"WORLD"}>World</MenuItem>
                        </Select>
                    </div>
                    <div className="lobby category-select">
                        <InputLabel className="lobby label">Rounds:</InputLabel>
                        <TextField
                            className="lobby round"
                            inputProps={{
                                style: { textAlign: "center" },
                            }}
                            placeholder="enter number of rounds..."
                            value={gameRounds}
                            onChange={(e) => setGameRounds(e.target.value)}
                        />
                    </div>
                </InformationContainer>
            </div>
            <div className="lobby button-container" style={{flexDirection:"column"}}>
                <div className="lobby button-container">
                {isMultiplayer ? (
                    <Button
                        style={{ display: "inline-block", margin: "0 10px"}}
                        onClick={() =>
                            createGame(selectedCategory, gameRounds, 30)
                        }
                    >
                        Create Game
                    </Button>
                ) : (
                    <Button
                    style={{ display: "inline-block", margin: "auto"}}
                    onClick={() =>
                      startGame(
                        selectedCategory,
                        gameRounds,
                        countdownTime
                      )
                    }
                  >
                    {loading ? <Spinner /> : 'Start Game'}
                  </Button>
                )}
                </div>
                <div>
                <Button
                    style={{ display: "inline-block", margin: "0 10px" }}
                    onClick={() => history.push("/JoinGame")}
                >
                    Join Multiplayer Game
                </Button>

                <Button
                    style={{ display: "inline-block", margin: "0 10px" }}
                    onClick={() => history.push("/home")}
                >
                    Back to Home Page
                </Button>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: "10px",
                    }}
                ></div>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
