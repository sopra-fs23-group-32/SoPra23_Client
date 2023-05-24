import { useHistory } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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


const RoundCountdown = () => {
  // use react-router-dom's hook to access the history
  const duration = 8;
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const [questionReady, setQuestionReady] = useState(false);

  const roundNumber = localStorage.getItem("roundNumber");
  const totalRounds = localStorage.getItem("totalRounds");
  const category = localStorage.getItem("category");
  const score = localStorage.getItem("score");
  const gameId = localStorage.getItem("gameId");
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

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const response = await api.put(`games/${gameId}`);
        setLocalStorageItems(response.data);
        console.log("Questions: ", response.data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.info("Question for next round gennerated.")
        setQuestionReady(true);
      }
      catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log(handleError(error));
      }
    }
    // fetch question and save in localstorage
    fetchQuestion();
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
    await api.delete(`games/${gameId}`);
    localStorage.removeItem("gameId");
    localStorage.removeItem("category");
    localStorage.removeItem("totalRounds");
    localStorage.removeItem("countdownTime");
    localStorage.removeItem("roundNumber");
    localStorage.removeItem("score");
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
          onClick={handleExitButtonClick}
        >
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
        <div className="roundcountdown layout" style={{ flexDirection: "row" }}>
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
export default RoundCountdown;
