import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "styles/views/game/FinalPage.scss";

const GameFinishPage = () => {
  const gameId = localStorage.getItem("gameId");
  const isSurvialMode = localStorage.getItem("isSurvialMode");
  const playerId = localStorage.getItem("userId");
  const history = useHistory();

  const endGame = async () => {
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("score");
    localStorage.removeItem("isSurvialMode");
    await api.delete(`games/${gameId}`);
    history.push("/home");
  };

  useEffect(() => {
    const saveGameLog = async () => {
      try {
        const responseGameInfo = await api.post(`/gameInfo/${gameId}`);
        console.log("Game Info saved: ", responseGameInfo.data);
        const responseGameHistory = await api.post(`/users/${playerId}/gameHistories/${gameId}`);
        console.log("Game history saved: ", responseGameHistory.data);
        toast.info("Game's Log saved.")
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        toast.error("Something went wrong while fetching the users!");
        console.log(handleError(error));
      }
    };
    saveGameLog();
  }, []);

  return (
    <div className="page-container">
    <div className="Finalpage container" style={{flexDirection: "column"}}>
    <InformationContainer className="finalpage container" style={{fontSize: '48px', width: "fit-content"}}>
      Your Singleplayer Game has ended <br/>
      {(isSurvialMode==="true")? `You survive for ${localStorage.getItem("roundNumber")-1} round(s) in the SurvivalMode`: ""}
    </InformationContainer>
    <InformationContainer className="finalpage container" style={{ fontSize: "40px" }}>
        You got: {localStorage.getItem("score")} Points
    </InformationContainer>
    <InformationContainer className="finalpage container">
      <div style={{ fontSize: "25px" }}>
        This game has been added to your Game History,
      </div>
      <div style={{ fontSize: "25px" }}>
        but your score won't be added to the leaderboard (Multiplayer only)
      </div>
      </InformationContainer>
      <div className="finalpage button-container">
        <Button style={{fontSize: "15px"}} onClick={() => endGame()}>
          Back to Home Page
        </Button>
      </div>
      <ToastContainer />
    </div>
    </div>
  );
};

export default GameFinishPage;
