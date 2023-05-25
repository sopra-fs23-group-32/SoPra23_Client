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
  const duration = 10;
  const [secondsLeft, setSecondsLeft] = useState(duration);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [previousRoundData] = useState([]);
  const [questionReady, setQuestionReady] = useState(false);

  const gameId = localStorage.getItem("gameId");
  const category = localStorage.getItem("category");
  const roundNumber = localStorage.getItem("roundNumber");
  const totalRounds = localStorage.getItem("totalRounds");
  const playerId = localStorage.getItem("userId");
  const username = localStorage.getItem("username")
  const score = localStorage.getItem("myScore");
  const isSurvivalMode = localStorage.getItem("isSurvivalMode");
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
      await api.put(`games/${gameId}`);
      // setLocalStorageItems(response.data);
      console.log("Generate questio.");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // toast.info(`Question for next round created.`);
      // setQuestionReady(true);
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
      setQuestionReady(true);
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
            if(messagBody.type === WebSocketType.ROUND_UPDATE) {
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
    // notify the backend to generate question
    if(roundNumber===1) {
      if(localStorage.getItem("isServer")==="true") {
        generateQuestion();
      }
    }
    else {
      generateQuestion();
    }
    // get all players' ranking
    fetchRanking();
  }, []);

  // go to next page when time out
  useEffect(() => {
    if (secondsLeft > 0 || questionReady) {
      const interval = setInterval(() => {
        setSecondsLeft((prevSecondsLeft) => {
          let newTimeLeft = prevSecondsLeft - 1;
  
          if (newTimeLeft <= 0) {
            if (questionReady) {
              history.push(`/MultiGamePage/${gameId}`);
            } else {
              toast.info("Waiting for new questions");
            }
          }
  
          return newTimeLeft;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, [secondsLeft, questionReady]);


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

  const convertCityCategory = (category) => {
    // Split the category by underscores
    const words = category.split('_');
  
    // Capitalize each word
    const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  
    // Join the words with spaces
    const convertedCategory = capitalizedWords.join(' ');
  
    return convertedCategory;
  }

  const handleExitButtonClick = async() => {
    await api.delete(`games/${gameId}/players/${playerId}`);
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("myScore");
    // localStorage.removeItem("isServer");
    localStorage.removeItem("isSurvivalMode");
    localStorage.removeItem("citynames");
    localStorage.removeItem("PictureUrl");
    localStorage.removeItem("CorrectOption");
    history.push("/home");
  };

  return (
  <div className="page-container">
    <div className="round countdown container">
      <div style={{ position: "fixed", top: 75, left: 75 }}>
        <Button style={{ fontSize: "30px", height: "60px", width: "100%" }}
         onClick={handleExitButtonClick}>
          Exit Game
        </Button>
      </div>

      <div className="roundcountdown layout" style={{ dislay: "flex" }}>
        <InformationContainer className="roundcountdown container_left">
          <div style={{ fontSize: "40px" }}>
          {isSurvivalMode==="true" ?
            <div>
              Round {roundNumber} is starting soon... <br />
              Try to survive in the next round :)
            </div>
             : `Round ${roundNumber} of ${totalRounds} is starting soon...`}
          </div>
          <div style={{ fontSize: "30px" }}>
            City Category: {convertCityCategory(category)}, Your Score: {score}
          </div>
        </InformationContainer>

        <div className="roundcountdown layout" style={{ display: "flex", flexDirection: "row" }}>
          <div className="roundcountdown leaderboard-container">
            <div className="leaderboard">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Player Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboardData.map((entry, index) => {
                    const previousRank = roundNumber > 1 ? previousRoundData.find((data) => data.playerName === entry.playerName)?.rank : entry.rank;
                    const position = calculateRowPosition(entry.rank, previousRank);
                    return (
                      <tr
                        key={entry.id}
                        style={{
                          transform: `translateY(${position})`,
                          backgroundColor: entry.playerName === username ? 'rgba(94,93,240,1.0)' : 'rgba(128, 128, 128, 0.5)',
                         }}
                      >
                        <td>{entry.rank}</td>
                        <td>{entry.playerName}</td>
                        <td>{entry.score}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div></div>
          <div></div>
          <div></div>
          <div className="roundcountdown container_right">
            <div className="countdown-text">
              <UrgeWithPleasureComponent duration={duration} />
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  </div>
  );
};
export default MultiModeRoundCountdown;
