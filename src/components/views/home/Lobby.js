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
    {player.userId} - {player.username}
  </div>
);
Players.propTypes = {
  player: PropTypes.object,
};

const Lobby = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [isMultiplayer, setIsMultiplayer] = useState(true);
  const handleToggle = () => {setIsMultiplayer(!isMultiplayer);};
  const [selectedCategory, setSelectedCategory] = useState('Europe');
  const [gameRounds, setGameRounds] = useState(null);

  const [players, setPlayers] = useState(null);

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");
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

  let playerlist = <Spinner />;
  if (players) {
    playerlist = (
      <ul>{players.map((player) => (
          <Players player={player} key={player.userId} />
        ))}
      </ul>
    );
  }

  return (
    <div className="lobby container">
      <p style={{fontSize: '48px', marginBottom: '5px'}}>
        <div>Game Settings</div>
      </p>
      <div className="lobby layout">
        <InformationContainer className="lobby container_left" 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '10px' }}>
            <div style={{ textAlign: 'right' }}><span style={{ fontSize: '18px' }}>Singleplayer</span></div>
            <div>
              <Switch checked={isMultiplayer}
              onChange={handleToggle}
              trackColor={{true: 'red', false: '#1979b8'}}
              disableRipple
              checkedIcon={false}
              uncheckedIcon={false} />
            </div>
            <div><span style={{ fontSize: '18px' }}>Multiplayer</span></div>
          </div>
          <div>
          <label className="lobby label">
              Pick a city category:
              <select name="selectedFruit"
              onChange={e => setSelectedCategory(e.target.value)}>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="North America">North America</option>
              </select>
            </label>
          </div>
          <div>
            <label className="lobby label">
              Enter rounds
              <input className="lobby input"
                placeholder="enter integer..."
                value={gameRounds}
                onChange={e => setGameRounds(e.target.value)}
              />
            </label>
          </div>
        </InformationContainer>

        <InformationContainer className="lobby container_right" 
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ fontSize: '20px', marginBottom: '20px'}}>
            <div>City Category: {selectedCategory}</div>
            <div>Game Rounds: {gameRounds}</div>
            <div>User list:</div>
          </p>
          <div>
            {playerlist}
          </div>
        </InformationContainer>
      </div>


      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
        <Button style={{ display: 'inline-block', margin: '0 10px'}}
          disabled={!isMultiplayer}
          onClick={() => history.push("/home")}>
          Invite to Game
        </Button>
        <Button style={{ display: 'inline-block', margin: '0 10px' }}
          onClick={() => history.push("/home")}>
          Start Game
        </Button>
      </div>
      <div>
        <Button style={{display: "block", margin: "auto"}}
          onClick={() => history.push("/home")}>
        Back to Home Page 
        </Button>
      </div>
    </div>

  );
  
};
export default Lobby;
