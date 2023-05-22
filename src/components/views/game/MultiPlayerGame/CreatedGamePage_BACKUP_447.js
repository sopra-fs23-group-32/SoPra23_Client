import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
<<<<<<< HEAD
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
} from "@mui/material";
import "styles/views/game/Lobby.scss";
=======
import { InputLabel, Select, MenuItem, TextField } from "@mui/material";
>>>>>>> main

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";

<<<<<<< HEAD
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
=======
import { ToastContainer, toast } from "react-toastify";
import "styles/views/game/WaitingPage.scss";

const CreatedGamePage = () => {
  const [gamePlayers, setGamePlayers] = useState([]);
  const [playerNumber, setPlayerNumber] = useState(
    localStorage.getItem("playerNum")
  );
  //
  const gameId = localStorage.getItem("gameId");
  const category = localStorage.getItem("category");
  const totalRounds = localStorage.getItem("totalRounds");
  const totalTime = localStorage.getItem("countdownTime");
  const isServer = localStorage.getItem("isServer");
>>>>>>> main

    const history = useHistory();

<<<<<<< HEAD
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
=======
  const fetchPlayer = async () => {
    try{
      const response = await api.get(`/games/${localStorage.getItem("gameId")}/players`);
      console.log("Players", response.data);
      setGamePlayers(response.data);
      setPlayerNumber(response.data.length);
    } catch (error) {
      toast.error(`Failed to fetch player in game(ID ${gameId})\n
        ${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  const fetchGameStatus = async () => {
    try {
      const response = await api.get(
        `/games/${localStorage.getItem("gameId")}/status`
      );
      console.log("GameStatus", response.data);
      if(response.data==="WAITING" || response.data==="ANSWERING"){
        localStorage.setItem("myScore", 0);
        localStorage.setItem("roundNumber", 1);
        history.push(`/MultiGamePage/${gameId}/RoundCountPage/`);
        localStorage.setItem("roundNumber", 1);
        history.push(`/MultiGamePage/${gameId}/RoundCountPage/`);
      }
      else if (response.data==="DELETED") {
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
    catch (error) {
      toast.error(`Failed to fetch player in game(ID ${gameId})\n //change this
        ${error.response.data.message}`);
      console.log(handleError(error));
      backToLobby();
    }
  };

  // automatically fetch player list
  useEffect(() => {
    toast.info(
      `Successfully add player '${username}'(ID ${userId}) to game(ID ${gameId})!`
    );
    const interval = setInterval(fetchPlayer, 3000);
    return () => {
      clearInterval(interval); // Clean up the interval on component unmount
    };
  }, []);

  useEffect(() => {
    if (isServer === "false") {
      const interval1 = setInterval(fetchGameStatus, 2000);
      return () => {
        clearInterval(interval1); // Clean up the interval on component unmount
      };
    }
  }, [isServer === "false"]);

  /*useEffect(() => {
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
  }, []); */

  const leaveGame = async () => {
    try{if (isServer === "true") {
      const response = await api.delete(`/games/${gameId}`);
      console.log("Delete game:", response.data);
    } else {
      const response = await api.delete(`/games/${gameId}/players/${userId}`);
      console.log("Delete player:", response.data);
    }}catch (error) {
      toast.error(`Failed to fetch player in game(ID ${gameId})\n
        ${error.response.data.message}`);
      console.log(handleError(error));
    }
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("playerNum");
    localStorage.removeItem("isServer");

  };

  const backToLobby = () => {
    leaveGame();
    history.push("/JoinGame");
  };
  const backToHome = () => {
    leaveGame();
    history.push("/home");
  };
>>>>>>> main

    const joinOther = () => {
        leaveGame();
        history.push('/JoinGame')
    }
   console.log("players: ",gamePlayers);
    {gamePlayers.map((player, index) => <p className="lobby player-name" key={index}>
    {console.log("Players",player.username)}
</p>)}

<<<<<<< HEAD
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
=======
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
    players: PropTypes.object,
  };
  let playerList = <Spinner />;

  if (gamePlayers !== null) {
    playerList = <Player players={gamePlayers} />;
  }

  return (
    <div className="waiting-page layout">
      <InformationContainer className="waiting-page container_left">
        <div style={{ fontSize: "40px", textAlign: "center" }}>
          Game Settings
        </div>
        <div className="waiting-page select">
          <InputLabel className="waiting-page label">Category</InputLabel>
          <Select
            value={category}
            disabled
            inputProps={{
              MenuProps: {
                sx: { borderRadius: "10px" },
                MenuListProps: {
                  sx: { backgroundColor: "#1979b8", color: "white" },
                },
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
          </Select>
        </div>
        <div className="waiting-page select">
          <InputLabel className="waiting-page label">Rounds:</InputLabel>
          <TextField
            className="waiting-page text"
            inputProps={{ style: { textAlign: "center" } }}
            value={totalRounds}
            disabled
          />
        </div>
        <div className="waiting-page select">
          <InputLabel className="waiting-page label">
            Countdown Time:
          </InputLabel>
          <TextField
            className="waiting-page text"
            inputProps={{ style: { textAlign: "center" } }}
            value={totalTime}
            disabled
          />
        </div>

        <div className="waiting-page button-container">
          <Button
            onClick={() => startGameMultiplayer(gameId)}
            disabled={isServer === "false"}
          >
            Start Game
          </Button>
          <Button onClick={() => backToLobby()}>Back to Lobby</Button>
          <Button onClick={() => backToHome()}>Back to Home Page</Button>
        </div>
      </InformationContainer>

      <InformationContainer className="waiting-page container_right">
        <p style={{ fontSize: "30px", marginBottom: "20px" }}>
          {playerNumber} playersare in the lobby :
        </p>
        <div>{playerList}</div>
      </InformationContainer>
    </div>
  );
>>>>>>> main
};

export default CreatedGamePage;
