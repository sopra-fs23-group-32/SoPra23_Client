import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import InformationContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { getDomain } from "helpers/getDomain";
import WebSocketType from "models/WebSocketType";
import "styles/views/game/GamePrepare.scss";

const UrgeWithPleasureComponent = ({ duration }) => (
  <CountdownCircleTimer
    isPlaying
    duration={duration}
    colors={['#1979B8 ', '#F7B801', '#A30000']}
    colorsTime={[10, 5, 0]}
    size={200}
    strokeWidth={20}
  >
    {({ remainingTime }) => remainingTime}
  </CountdownCircleTimer>
);

const MultiModeRoundCountdown = () => {
  // use react-router-dom's hook to access the history
  const duration = 12;
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [intervalId, setIntervalId] = useState(null);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [previousRoundData, setPreviousRoundData] = useState([]);
  const [isFetch, setIsFetch] = useState(false);

  const gameId = localStorage.getItem("gameId");
  const category = localStorage.getItem("category");
  const roundNumber = localStorage.getItem("roundNumber");
  const totalRounds = localStorage.getItem("totalRounds");
  const playerId = localStorage.getItem("userId");
  const username = localStorage.getItem("username")
  const score = localStorage.getItem("myScore");
  const isServer = localStorage.getItem("isServer");
  const history = useHistory();

  const setLocalStorageItems = (question) => {
    const cityNamesString = JSON.stringify([
      question.option1, question.option2, question.option3, question.option4,
    ]);
    localStorage.setItem("citynames", cityNamesString);
    localStorage.setItem("PictureUrl", question.pictureUrl);
    localStorage.setItem("CorrectOption", question.correctOption);
  };

  async function generateQuestion() {
    try {
      const response = await api.put(`games/${gameId}`);
      setLocalStorageItems(response.data);
      console.log("Generate question: ", response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info(`Question for next round created.`);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  }

  async function fetchQuestion() {
    try {
      const response = await api.get(`games/${gameId}/questions`);
      setLocalStorageItems(response.data);
      console.log("Fetch question: ", response.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.info(`Got question for next round.`);
      setIsFetch(true);
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  }

  // handle msg from the web socket
  useEffect(() => {
    let subscription;
    const Socket = new SockJS(getDomain() + "/socket");
    const stompClient = Stomp.over(Socket);
    stompClient.connect(
      {}, (frame) => {
        subscription = stompClient.subscribe(`/instance/games/${gameId}`,
          async (message) => {
            const messagBody = JSON.parse(message.body);
            console.log("Socket mssage: ", messagBody.type);
            if(isServer==="false" && 
              messagBody.type === WebSocketType.ROUND_UPDATE){
                fetchQuestion();
            }
          }
        );
      },
      (err) => console.log(err)
    );
    return () => {subscription.unsubscribe();};
  }, []);

  useEffect(() => {
    async function fetchRanking() {
      try {
        const response = await api.get(`/games/${gameId}/ranking`);
        // if (roundNumber === 1) {
        //   setPreviousRoundData(leaderboardData);
        //   console.log("Previous round data", leaderboardData)
        // }
        setLeaderboardData(response.data);
        console.log("Ranking: ", response.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log(handleError(error));
      }
    }
    // remove all local storage of previous question
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    // fetch question and save in localstorage
    if (isServer==="true") {generateQuestion();}
    // get all players' ranking
    fetchRanking();
    // set a timer
    const intervalId = setInterval(() => {
      setSecondsLeft((prevSecondsLeft) => prevSecondsLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  // go to next page when time out
  useEffect(() => {
    if (secondsLeft === 0) {
      clearInterval(secondsLeft);
      clearInterval(intervalId);
      // if (isServer === "false") {fetchQuestion();}
      history.push(`/MultiGamePage/${gameId}`);
    }
  }, [secondsLeft, intervalId]);

  const calculateRowPosition = (currentRank, previousRank) => {
    const position = currentRank - previousRank;
    return position * 100 + '%';
  };

  const PlayerRanking = ({leaderboardData}) => (
    <table className="leaderboard">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Player Name</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {leaderboardData.map((rankEntry, index) => {
          const previousRank = roundNumber > 1 ? 
            previousRoundData.find((data) => data.playerName === rankEntry.playerName)?.rank
             : rankEntry.rank;
          const position = calculateRowPosition(rankEntry.rank, previousRank);

          <tr key={rankEntry.playerName}
            style={{ transform: `translateY(${position})`,
              backgroundColor: rankEntry.playerName === username ? 'rgba(200, 0, 0, 0.5)' : 'rgba(128, 128, 128, 0.5)',}}
          >
            <td>{rankEntry.rank}</td>
            <td>{rankEntry.playerName}</td>
            <td>{rankEntry.score}</td>
          </tr>
        })}
      </tbody>
    </table>
  )
  PlayerRanking.propTypes = {
    rankEntry: PropTypes.object,
  };

  let playerRankingList = <Spinner />

  if (leaderboardData !== null) {
    playerRankingList = (
      <PlayerRanking leaderboardData={leaderboardData} />
    );
  }

  const handleExitButtonClick = async() => {
    await api.delete(`games/${gameId}/players/${playerId}`);
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("myScore");
    localStorage.removeItem("isServer");
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    history.push("/home");
  };

  return (
    <div className="round countdown container">
      <div >
        <Button className="round countdown exit-button"
          onClick={handleExitButtonClick}
        
        >
          Exit Game
        </Button>
      </div>

      <div className="roundcountdown layout" style={{ dislay: "flex" }}>
        <InformationContainer className="roundcountdown container_left">
          <div style={{ fontSize: "40px" }}>
            Round {roundNumber} of {totalRounds} is starting soon...
          </div>
          <div style={{ fontSize: "30px" }}>
            City Category: {category}, Your Score: {score}
          </div>
        </InformationContainer>

        <div className="roundcountdown layout" style={{ display: "flex", flexDirection: "row" }}>
          <div className="roundcountdown leaderboard-container">
            {playerRankingList}
          </div>

          <div className="roundcountdown container_right">
            <div className="countdown-text">
              <UrgeWithPleasureComponent duration={duration} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};
export default MultiModeRoundCountdown;
