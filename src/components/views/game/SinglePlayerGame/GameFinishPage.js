import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "styles/views/game/FinalPage.scss";

const GameFinishPage = () => {
  const history = useHistory();

  const endGame = async () => {
    await api.delete(`games/${localStorage.getItem("gameId")}`);
    history.push("/home");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseGameInfo = await api.post(
          `/gameInfo/${localStorage.getItem("gameId")}`
        );
        console.log(responseGameInfo.data);
        const responseGameHistory = await api.post(
          `/users/${localStorage.getItem("userId")}/gameHistories/${localStorage.getItem("gameId")}`
        );
        console.log("gamehistory", responseGameHistory.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
      catch (error) {
        toast.error("Something went wrong while fetching the users!");
        console.log(handleError(error));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="finalpage container">
      <h2 style={{ font: "40px" }}>
        -- Single Player Game Ended --
      </h2>

      <h2 style={{ font: "40px" }}>
        You got {localStorage.getItem("score")} Pts
      </h2>
      <h2 style={{ font: "30px" }}>
        Your Game History has saved,
      </h2>
      <h2 style={{ font: "30px" }}>
        but your score won't added to the leaderboard
      </h2>
      
      <div className="final button-container">
        <Button onClick={() => endGame()}>
          Back to Home Screen
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default GameFinishPage;
