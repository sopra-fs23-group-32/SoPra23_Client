import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";

import { IconButton } from "@mui/material";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import InformationContainer from "components/ui/BaseContainer";

import "styles/views/History.scss";

const Answers = ({ answer }) => (
  <div className="history label">
    {answer.answer} - {answer.correctAnswer}
  </div>
);
Answers.propTypes = {
  answer: PropTypes.object,
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: '#2196f3',
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const HistoryPage = () => {
  const history = useHistory();
  const [userGameInfo, setUserGameInfo] = useState([]);
  const [userGameHistoryScore, setUserGameHistoryScore] = useState(0);
  const [userGameHistoryAnswer, setUserGameHistoryAnswer] = useState([]);
  const [open, setOpen] = useState(false);
  const [gameId, setGameId] = useState(1);
  const handleOpen = (gameId) => {setGameId(gameId); setOpen(true);};
  const handleClose = () => setOpen(false);
  
  useEffect(() => {
    async function fetchGameInfoData() {
      try {
        const url = "/users/" + localStorage.getItem("userId") + "/gameInfo";
        const response = await api.get(url);
        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Get the returned users and update the state.
        setUserGameInfo(response.data);
        console.log(response);
      } catch (error) {
        console.error(
          `An error occurs while fetching the userGameInfo: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert("Something went wrong while fetching the userGameInfo.");
      }
    }
    fetchGameInfoData();
  }, []);

  async function fetchGameHistoryData(gameId) {
    try {
      const url = "/users/"+localStorage.getItem("userId") + "/gameHistories/"+gameId;
      const responseScore = await api.get(url + "/score");
      const responseAnswer = await api.get(url + "/answer");
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // Get the returned users and update the state.
      setUserGameHistoryScore(responseScore.data);
      console.log(responseScore);
      setUserGameHistoryAnswer(responseAnswer.data);
      console.log(responseAnswer);
      
    } catch (error) {
      console.error(
        `An error occurs while fetching the userGameHistory: \n${handleError(error)}`
      );
      console.error("Details:", error);
      alert("Something went wrong while fetching the userGameHistory.");
    }
  }

  
  const UserGameInfo = ({ userGameInfo }) => (
    <>
      {userGameInfo.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Game Id</th>
              <th>Category</th>
              <th>Date</th>
              <th>Rounds</th>
              <th>Player Number</th>
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {userGameInfo.map((gameInfo, index) => (
              <tr className={index % 2 !== 0 ? "odd" : "even"} key={gameInfo.gameId}>
                <td style={{ width: "12%", textAlign: "center" }}>{gameInfo.gameId}</td>
                <td style={{ width: "20%", textAlign: "center" }}>{gameInfo.category}</td>
                <td style={{ width: "20%", textAlign: "center" }}>{new Date(gameInfo.gameDate).toISOString().slice(0,10)}</td>
                <td style={{ width: "20%", textAlign: "center" }}>{gameInfo.gameRounds}</td>
                <td style={{ width: "20%", textAlign: "center" }}>{gameInfo.playerNum}</td>
                <td>
                  <IconButton
                    title="Detials"
                    color="primary"
                    onClick={() => {
                      handleOpen(gameInfo.gameId);
                      fetchGameHistoryData(gameInfo.gameId);
                    }}
                  >
                    <ArrowDropDownCircleIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="no-games-message">No games have been played yet.</div>
      )}
    </>
  );
  UserGameInfo.propTypes = {
    gameInfo: PropTypes.object,
  };

  let userGameInfoList = <Spinner />;

  if (userGameInfo) {
    userGameInfoList = (
      <UserGameInfo userGameInfo={userGameInfo} />
    );
  }
    
  return (
    <div className="history container">
      <InformationContainer className="history container" style={{fontSize: '48px', width: "fit-content"}}>Your Game History: {localStorage.getItem("username")}</InformationContainer>
      <InformationContainer className="history container">
      <div>{userGameInfoList}</div>
      <div className="history button-container">
        <Button width="300%" onClick={() => history.push("/home")}>
          Return to Home
        </Button>
      </div>
      </InformationContainer>    
    </div>
  );
};

export default HistoryPage;
