import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import "styles/views/game/Lobby.scss";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";

const CreatedGamePage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(localStorage.getItem("userId"));
    const [gameId, setGameId] = useState(localStorage.getItem("gameId"));
    const [selectedCategory, setSelectedCategory] = useState(
        localStorage.getItem("category")
    );
    const [gamePlayers, setGamePlayers] = useState([]);
    const [gameRounds, setGameRounds] = useState(
        localStorage.getItem("totalRounds")
    );
    const [targetPlayerNumber, setTargetPlayerNumber] = useState(
        localStorage.getItem("gamePlayer") 
    );
    const [countdownTime, setCountdownTime] = useState(10);
    const [isServer, setIsServer] = useState(localStorage.getItem("isServer"));

    const history = useHistory();

    const handleSub = async () => {
        const response = await api.get(
            `/games/${localStorage.getItem("gameId")}/players`
        );
        setGamePlayers(response.data);
        setTargetPlayerNumber(response.data.length);
    };

    const addUser = async () => {
        if(localStorage.isServer == 0) {
            const response = await api.post(`/games/${localStorage.getItem("gameId")}/players/${localStorage.getItem("userId")}`);
            console.log("You Joined the game", response.data);
        }
    }

    const leaveGame = async () => {
        if(localStorage.isServer == 1) {
            const response = await api.delete(`/games/${gameId}/players/${userId}`);
            const response1 = await api.delete(`/games/${gameId}`);
        } else {
            const response = await api.delete(`/games/${gameId}/players/${userId}`);
        }
    }

    const backToHome = () => {
        leaveGame();
        history.push('/home');
    }

    const joinOther = () => {
        leaveGame();
        history.push('/JoinGame')
    }
   console.log("players: ",gamePlayers);
    {gamePlayers.map((player, index) => <p className="lobby player-name" key={index}>
    {console.log("Players",player.username)}
</p>)}

    useEffect(() => {
        addUser();
        handleSub();
        const Socket = new SockJS(getDomain() + "/socket");
        const stompClient = Stomp.over(Socket);
        let subscription;
        stompClient.connect(
            {},
            (frame) => {
                console.log("Socket connected!");
                console.log(frame);
                subscription = stompClient.subscribe(`/instance/games/${gameId}`, (message) => {                    
                    const messagBody = JSON.parse(message.body);
                    if(messagBody.type == WebSocketType.GAME_END && localStorage.getItem("roundNumber") == localStorage.getItem("totalRounds")) {
                        history.push('/lobby');
                    }
                    else if(messagBody.type == WebSocketType.PLAYER_ADD || messagBody.type == WebSocketType.PLAYER_REMOVE) {
                        handleSub();
                    } else if(messagBody.type == WebSocketType.ROUND_UPDATE) {
                        const currentRound = Number(localStorage.getItem("roundNumber"));
                        localStorage.setItem("roundNumber", currentRound + 1);
                        history.push(`/MultiPlayerGamePage/${gameId}/RoundCountPage/`);
                    }
                });
            },
            (err) => console.log(err)
        );
        return () => {
            subscription.unsubscribe();
        }
    }, []);

    const startGameMultiplayer = async (gameId) => {
        localStorage.setItem("score", 0);
        const response = await api.put(`games/${gameId}`);
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
                    <div style={{ fontSize: "40px", textAlign: "center" }}>
                        Game Settings
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
                            disabled
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
                            disabled
                        />
                    </div>
                    <div className="lobby category-select">
                        <InputLabel className="lobby label">
                            Players:
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="player"
                            value={targetPlayerNumber}
                            disabled
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
                            className="lobby player"
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={2}>2</MenuItem>
                            <MenuItem value={3}>3</MenuItem>
                            <MenuItem value={4}>4</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={6}>6</MenuItem>
                        </Select>
                    </div>

                    <div></div>
                    <div className="lobby label">
                        {isServer == 1 ? (
                            <Button
                                style={{
                                    display: "inline-block",
                                    margin: "0 10px",
                                }}
                                onClick={() =>
                                    startGameMultiplayer(
                                        localStorage.getItem("gameId")
                                    )
                                }
                            >
                                Start Game
                            </Button>
                        ) : null}

                        <Button
                            style={{
                                display: "inline-block",
                                margin: "0 10px",
                            }}
                            onClick={() => joinOther()}
                        >
                            Join Other Game
                        </Button>

                        <Button
                            style={{
                                display: "inline-block",
                                margin: "0 10px",
                            }}
                            onClick={() => backToHome()}
                        >
                            Back to Home Page
                        </Button>
                    </div>
                </InformationContainer>
                <InformationContainer
                    className="lobby container_right"
                    style={{ display: "flex", flexDirection: "column" }}
                >
                    <p style={{ fontSize: "20px", marginBottom: "20px" }}>
                        Users in the lobby:
                    </p>
                    {gamePlayers.map((player, index) => <p className="lobby player-name" key={index}>
                        {player.username}
                    </p>)}
                </InformationContainer>
            </div>
        </div>
    );
};

export default CreatedGamePage;
