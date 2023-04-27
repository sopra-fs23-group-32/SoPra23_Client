import { useHistory } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
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
  const history = useHistory();
  const [players, setPlayers] = useState(null);

  
  const getGameInfo = async () => {
    const response = await api.get(`/games/${localStorage.getItem('gameId')}/`);
    
    var currentRound = response.data.currentRound;
    // input User Ranking when implemented
  };
  
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
        <div style={{dislay: "flex"}}>     

        <InformationContainer className="lobby container_left" id="information-container">
          <div style={{fontSize:'40px'}}>
            {/* Replace 2 with {currentRound+1} and 5 with {roundNumber}*/}
            The last round has been played
          </div>
          </InformationContainer>
          <div>
            <InformationContainer className="lobby container_left" id="information-container">
                The final leaderboard: 
                {playerlist}
            </InformationContainer>
            <Button style={{display: "block", margin: "auto"}}>
                Back to Home Screen
            </Button>
      
      
      </div>
      </div>
    </div>

  );
  
};
export default RoundCountdown;
