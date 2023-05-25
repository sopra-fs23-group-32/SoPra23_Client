import { useHistory } from "react-router-dom";
import React, { useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "styles/views/game/FinalPage_Single.scss";

const GameFinishPage = () => {
  const gameId = localStorage.getItem("gameId");
  const isSurvivalMode = localStorage.getItem("isSurvivalMode");
  const playerId = localStorage.getItem("userId");
  const history = useHistory();

  const endGame = async () => {
    if (isSurvivalMode==="false") {
      await api.delete(`games/${gameId}`);
    }
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("score");
    localStorage.removeItem("isSurvivalMode");
    history.push("/home");
  };

  

  useEffect(() => {
    async function saveGameLog() {
      try {
        const responseGameHistory = await api.post(`/users/${playerId}/gameHistories/${gameId}`);
        console.log("Game history saved: ", responseGameHistory.data);
        toast.info("Game history saved.")
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (isSurvivalMode==="true") {
          await api.delete(`games/${gameId}/players/${playerId}?check=0`);
          await new Promise((resolve) => setTimeout(resolve, 500));
          console.log(`You leave Game ${gameId}.`)
        }

        const responseGameInfo = await api.post(`/gameInfo/${gameId}`);
        console.log("Game Info saved: ", responseGameInfo.data);
        toast.info("Game's Info saved.")
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        toast.error("Something went wrong while saving the gameInfo!");
        console.log(handleError(error));
      }
    }
    saveGameLog();
  }, []);

  return (
    <div className="page-container">
    <div className="Finalpage container" style={{flexDirection: "column"}}>
    <InformationContainer className="finalpage container" style={{fontSize: '48px', width: "fit-content"}}>
      Your Singleplayer Game has ended <br/>
      {(isSurvivalMode==="true")? `You survive for ${localStorage.getItem("roundNumber")-1} round(s) in the SurvivalMode`: ""}
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
