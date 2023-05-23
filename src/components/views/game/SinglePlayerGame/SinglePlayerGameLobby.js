import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { Spinner } from "components/ui/Spinner";

import { InputLabel, Select, MenuItem, TextField } from "@mui/material";
import Switch from "react-switch";
import "styles/views/game/Lobby.scss";
const SinglePlayerLobby = () => {
    const survivalModeGameRounds = 999999;
    const [isLoadingGame, setIsLoadingGame] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("EUROPE");
    const [gameRounds, setGameRounds] = useState(1);
    const [countdownTime, setCountdownTime] = useState(10);
    const [isSurvivalMode, setIsSurvivalMode] = useState(false);

    // use react-router-dom's hook to access the history
    const history = useHistory();

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

    const handleSurvivalToggle = () => {
        setIsSurvivalMode(!isSurvivalMode);
    };

    const startGameSingleplayer = async (
        category,
        gameRounds,
        gameDuration
    ) => {
        try {
            //create gameID

            const requestBody = {
                category: category,
                totalRounds: isSurvivalMode?survivalModeGameRounds:gameRounds,
                countdownTime: gameDuration,
            };
            const response = (await api.post("/games", requestBody)).data;
            const gameId = response.gameId;

            localStorage.setItem("gameId", gameId);
            localStorage.setItem("survival", isSurvivalMode);
            localStorage.setItem("score", 0);
            localStorage.setItem("category", category);
            localStorage.setItem("totalRounds", isSurvivalMode?survivalModeGameRounds:gameRounds);
            localStorage.setItem("roundNumber", 1);

            await fetchQuestion(gameId);
            await handleAddPlayer(localStorage.getItem("userId"));
            setTimeout(() => {
                history.push(`/gamePage/${gameId}`);
            }, 1000);
        } catch (error) {
            alert(
                `Something went wrong during game start: \n${handleError(
                    error
                )}`
            );
        }
    };

    const handleAddPlayer = async (playerID) => {
        try {
            const gameID = localStorage.getItem("gameId");
            const response = await api.post(
                `/games/${gameID}/players/${playerID}`
            );
        } catch (error) {
            console.error("Error adding player", error);
        }
    };

    localStorage.setItem("countdownTime", countdownTime);
    localStorage.setItem("sameCoundownTime", countdownTime);

    return (
        <div className="lobby container">
            <div className="lobby layout">
                <InformationContainer
                    className="lobby container_left"
                    id="information-container"
                >
                    <div style={{ fontSize: "3rem" }}>Game Settings</div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto 1fr",
                            gap: "10px",
                        }}
                    ></div>
                    <div className="lobby category-select">
                        <InputLabel className="lobby label">
                            Select Region
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
                                            backgroundColor: "rgba(65, 63, 240, 0.7)",
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
                        <InputLabel className="lobby label">
                            Survival Mode:
                        </InputLabel>
                        <div className="survival-switch">
                            <Switch
                                checked={isSurvivalMode}
                                onChange={handleSurvivalToggle}
                                offColor="#aaaacd"
                                onColor="#413fdc"
                                checkedIcon={false}
                                uncheckedIcon={false}
                            />
                        </div>
                    </div>
                    <div className="lobby category-select">
                        <InputLabel className="lobby label">Rounds:</InputLabel>
                        <TextField
                            className="lobby round"
                            inputProps={{
                                style: {
                                    fontSize: "1rem",
                                    textAlign: "center",
                                },
                            }}
                            disabled={isSurvivalMode?true:false}
                            placeholder="enter number of rounds..."
                            value={gameRounds}
                            onChange={(e) => setGameRounds(e.target.value)}
                        />
                    </div>
                </InformationContainer>
            </div>
            <div className="lobby_buttons">
                {isLoadingGame ? (
                    <Spinner />
                ) : (
                    <>
                        <Button
                            onClick={() => {
                                setIsLoadingGame(true);
                                startGameSingleplayer(
                                    selectedCategory,
                                    gameRounds,
                                    countdownTime
                                );
                            }}
                            style={{
                                display: "inline-block",
                                marginRight: "10px",
                            }}
                        >
                            Start Game
                        </Button>

                        <Button
                            onClick={() => history.push("/home")}
                            style={{
                                display: "inline-block",
                                marginRight: "10px",
                            }}
                        >
                            Back to Home Page
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
};

export default SinglePlayerLobby;
