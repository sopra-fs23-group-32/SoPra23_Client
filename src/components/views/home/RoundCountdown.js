import { useHistory } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from 'react-switch';
import PropTypes from "prop-types";

import "styles/views/home/Lobby.scss";

const Players = ({ player }) => (
  <div className="user user-info">
    {player.rank} - {player.username}
  </div>
);
Players.propTypes = {
  player: PropTypes.object,
};

const RoundCountdown = () => {
  // use react-router-dom's hook to access the history
  const [roundNumber, setRoundNumber] = useState(localStorage.getItem('totalRounds'));
  const [score, setScore] = useState(localStorage.getItem("playerScore"));
  const history = useHistory();
  const [players, setPlayers] = useState(null);
  const [secondsLeft, setSecondsLeft] = useState(10);
  const [intervalId, setIntervalId] = useState(null);

  

  
  const getGameInfo = async () => {
    const response = await api.get(`/games/${localStorage.getItem('gameId')}/`);
    
    var currentRound = response.data.currentRound;
    // input User Ranking when implemented
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft(prevSecondsLeft => prevSecondsLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect (() => {
    if (secondsLeft === 0) {
        clearInterval(intervalId)
    }
  }, [secondsLeft, intervalId]);

  
  useEffect(() => {    

    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/games/${localStorage.getItem('gameId')}/ranking`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Get the returned users and update the state.
        setPlayers(response.data);
        console.log(response);
      } catch (error) {
        console.error(`An error occurs while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users!");
      }
    }
    fetchData();
  }, []);


const handleExitButtonClick = () => {
    history.push("/Home");
  };


  let playerlist = <Spinner />;
  if (players) {
    playerlist = (
      <ul>{players.map((player) => (
          <Players player={player} key={player.rank} />
        ))}
      </ul>
    );
  }

  return (
    <div className="round countdown container">
        <div style={{position: 'fixed', top: 75, left: 75}}><Button style={{fontSize: '45px', height:"100px", width: "125%"}} onClick={handleExitButtonClick}>
        Exit 
      </Button>
      </div>
      <div style={{dislay: "flex"}}>     

      <InformationContainer className="lobby container_left" id="information-container">
          <div style={{fontSize:'40px'}}>
            {/* Replace 2 with {currentRound+1} and 5 with {roundNumber}*/}
            Round 2 of 5 is starting soon...
          </div>
          </InformationContainer>
            <div className="lobby layout" style={{flexDirection:"row"}}>
            <InformationContainer className="lobby container_left" id="information-container">
                Leaderboard: 
                {playerlist}
            </InformationContainer>
            <InformationContainer className="lobby container_left" id="information-container">
            <div style={{fontSize:'40px'}}>
                {secondsLeft}
            </div>
            </InformationContainer>   
      
      
      </div>
      </div>
    </div>

  );
  
};
export default RoundCountdown;
