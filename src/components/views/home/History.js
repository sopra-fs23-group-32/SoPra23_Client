import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import InformationContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { IconButton } from "@mui/material";
import ArrowDropDownCircleIcon from "@mui/icons-material/ArrowDropDownCircle";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "styles/views/home/History.scss";

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
  const [userGameInfo, setUserGameInfo] = useState(null);
  const [userGameHistoryStats, setUserGameHistoryStats] = useState({gameScore: 0, correctRate: 0.00});
  const [userGameHistoryAnswer, setUserGameHistoryAnswer] = useState([]);
  const [open, setOpen] = useState(false);
  const [gameId, setGameId] = useState(2);
  const handleOpen = (gameId) => {setGameId(gameId); setOpen(true);};
  const handleClose = () => setOpen(false);
  
  useEffect(() => {
    async function fetchGameInfoData() {
      try {
        const response = await api.get(`/users/${localStorage.getItem("userId")}/gameInfo`);
        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Get the returned users and update the state.
        setUserGameInfo(response.data);
        console.log(response);
      } catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log(handleError(error));
      }
    }
    fetchGameInfoData();
  }, []);

  async function fetchGameHistoryData(gameId) {
    try {
      const url = "/users/"+localStorage.getItem("userId") + "/gameHistories/"+gameId;
      const responseStats = await api.get(url + "/stats");
      setUserGameHistoryStats(responseStats.data);
      console.log(responseStats);
      const responseAnswer = await api.get(url + "/answer");
      setUserGameHistoryAnswer(responseAnswer.data);
      console.log(responseAnswer);
      // delays continuous execution of an async operation for 1 second.
      // This is just a fake async call, so that the spinner can be displayed
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      toast.error(
        `An error occurs while fetching the userGameHistory: \n${error.respond.data.message}`
      );
      console.log(handleError(error));
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
                <IconButton title="Detials" color="primary"
                  onClick={() => {
                    handleOpen(gameInfo.gameId);
                    fetchGameHistoryData(gameInfo.gameId);
                  }}
                >
                  <ArrowDropDownCircleIcon />
                </IconButton>
              </td>
              <Modal open={open} onClose={handleClose}
                aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description"
              >
                <Box color="primary" sx={style}>
                  <Typography id="modal-modal-title" variant="h4" component="h2">
                    Game ID - {gameId}
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 3 }}>
                    <div>Score: {userGameHistoryStats.gameScore}</div>
                    <div>CorrectRate: {userGameHistoryStats.correctRate}</div>
                  </Typography>
                  <Typography id="modal-modal-description" sx={{ mt: 3 }}>
                    <h3>Your Answer - Correct Answer</h3>
                    <div>{userGameHistoryAnswer.map((answer) => (
                        <Answers answer={answer}/>
                      ))}</div>
                  </Typography>
                </Box>
              </Modal>
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

  let userGameInfoList = <Spinner />

  if (userGameInfo !== null) {
    userGameInfoList = (
      <UserGameInfo userGameInfo={userGameInfo} />
    );
  }
    
  return (
    <div className="History container" style={{flexDirection:"column"}}>
      <InformationContainer className="history container" style={{fontSize: '48px', width: "fit-content"}}>
        Your Game History:  {localStorage.getItem("username")}
      </InformationContainer>
      <InformationContainer className="history container">
        <div>{userGameInfoList}</div>
        <div className="history button-container">
        <Button width="300%" onClick={() => history.push("/home")}>
          Return to Home
        </Button>
      </div>
      </InformationContainer>
      <ToastContainer />
    </div>
  );
};

export default HistoryPage;
