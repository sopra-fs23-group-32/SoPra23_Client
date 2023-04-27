import { useHistory } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from 'react-switch';
import PropTypes from "prop-types";
import CityCategory from "models/CityCategory"
import WebSocketType from "models/WebSocketType";
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
  localStorage.removeItem("roundNumber");
  localStorage.setItem("roundNumber", 1);

  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [isMultiplayer, setIsMultiplayer] = useState(true);
  const handleToggle = () => {setIsMultiplayer(!isMultiplayer);};
  const [gameRounds, setGameRounds] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);

  const [players, setPlayers] = useState(null);


  useEffect(() => {    
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Get the returned users and update the state.
        setPlayers(response.data);
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
    localStorage.setItem("players", JSON.stringify(players));

  }

  let playerlist2 = JSON.parse(localStorage.getItem("players"));
  let players_local = [];
  
  if (playerlist2) {
    playerlist2.forEach((player) => {
      players_local.push([player.username, player.userId]);
    });
  }
localStorage.setItem("players_local",players_local);
const playerId=localStorage.getItem("players_local").split(',')[1]


  const setLocalStorageItems = (question) => {
    const cityNamesString = JSON.stringify([question.option1, question.option2, question.option3, question.option4]);
    localStorage.setItem("citynames2", cityNamesString);
    localStorage.setItem("PictureUrl", question.pictureUrl);
    localStorage.setItem("CorrectOption", question.correctOption);
  };


  
    const fetchQuestion = async (gameId) => {
      try {
        const response = await api.put(`games/${gameId}`);
        const question = response.data;
        setLocalStorageItems(question);
        return question;
      } catch (error) {
        throw error;
      }
    };
  
   
  
  
  const startGameSingleplayer = async (category, gameRounds, gameDuration) => {
    try {
      
      
      let category_uppercase = category.toUpperCase();
  
      const requestBody = {
        category: category_uppercase,
        totalRounds: gameRounds,
        countdownTime: gameDuration,
      };
      localStorage.setItem("totalRounds",gameRounds);
      localStorage.removeItem("citynames2");
      localStorage.removeItem("PictureUrl");
      localStorage.removeItem("CorrectOption");
      
      const response = await api.post("/games", requestBody);
      
      const gameId = response.data.gameId;
      await localStorage.setItem("gameId", gameId);
      await fetchQuestion(gameId);
      const playerId2=localStorage.getItem("userId");
      localStorage.setItem("score",0);
      console.log("Id from logged in payer: ",playerId2);
      handleAddPlayer(playerId2);
      setTimeout(() => {
        history.push(`/gamePage/${gameId}`);
      }, 1000);
  
  

    } catch (error) {
      alert(`Something went wrong during game start: \n${handleError(error)}`);
    }
  };
  
  


const [username, setUsername] = useState('');

const handleUsernameChange = (event) => {
  setUsername(event.target.value);
};

const handleAddPlayer = async (playerId) => {
  try {
    const gameId=localStorage.getItem("gameId");
    const response = await api.post(`/games/${gameId}/players/${playerId}`);
    console.log('Player added successfully', response);
  } catch (error) {
    console.error('Error adding player', error);
  }
};

const startGameMultiplayer = async (category, gameRounds, gameDuration) => {
  try {
    let category_uppercase = category.toUpperCase();

    const requestBody = {
      category: category_uppercase,
      totalRounds: gameRounds,
      countdownTime: gameDuration,
    };
    
    const response = await api.post("/games", requestBody);
    const gameId = response.data.gameId;
    localStorage.setItem("gameId", gameId);
    console.log(localStorage.getItem("playerId"))
    //handleAddPlayer(localStorage.getItem("po"))
    
    history.push(`/gamePage/${gameId}`);
  } catch (error) {
    alert(`Something went wrong during game start: \n${handleError(error)}`);
  }
};

localStorage.setItem("countdownTime", countdownTime);  
localStorage.setItem("sameCoundownTime",countdownTime);
  const [selectedCategory, setSelectedCategory] = useState("Europe");
  return (
    <div className="lobby container">
      <p style={{fontSize: '48px', marginBottom: '5px'}}>
        <div>Game Lobby</div>
      </p>
      <div className="lobby layout">
        <InformationContainer className="lobby container_left" id="information-container">
          <div style={{fontSize:'40px'}}>
            Game Settings
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '10px' }}>
            
         <div style={{ textAlign: 'right' }}><span style={{ fontSize: '20px' }}>Singleplayer</span></div>
            <div>
              <Switch checked={isMultiplayer}
              onChange={handleToggle}
              offColor="#1979b8"
              onColor="#1979b8"
              checkedIcon={false}
              uncheckedIcon={false} />
            </div>
            <div><span style={{ fontSize: '20px'}}>Multiplayer</span></div>
          </div>
          
          <div><label className="lobby label">
            <label>Pick a city category:</label>
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
                <option value="World">World</option>
              </select>
          </label></div>
          
          <div><label className="lobby label">
            Enter Number of Rounds:
                <input className="lobby input" 
                  style={{marginLeft:"10px", textAlign:"center"}}
                  placeholder="enter number of rounds..."
                  value={gameRounds}
                  onChange={e => setGameRounds(e.target.value)}
                />
          </label></div>

          <div><label className="lobby label">
            Enter Round Duration:
                <input className="lobby input" 
                  style={{marginLeft:"10px", textAlign:"center"}}
                  placeholder="enter round duration..."
                  value={countdownTime}
                  onChange={e => setCountdownTime(e.target.value)}
                />
          </label></div>

          <div><label className="lobby label">
      Enter username to add to game:
      <input className="lobby input" 
        style={{marginLeft:"10px", textAlign:"center"}}
        placeholder="enter username..."
        value={username} onChange={handleUsernameChange} />
      <button onClick={handleAddPlayer}>Add player</button>
          </label></div>
        </InformationContainer>

        <InformationContainer className="lobby container_right" 
        style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '20px', marginBottom: '20px'}}>
            <div>Users in the lobby:</div></p>
          <div>
          {playerlist}
          </div>
        </InformationContainer>
      </div>
    <div className="lobby buttons">
    <Button style={{ display: 'inline-block', margin: '0 10px' }}onClick={() => isMultiplayer ? startGameMultiplayer(selectedCategory,gameRounds,30) : startGameSingleplayer(selectedCategory,gameRounds,countdownTime)}>Start Game</Button>
    <Button style={{ display: 'inline-block', margin: '0 10px'}}onClick={() => history.push("/home")}>Invite to Game</Button>
    <Button style={{display: 'inline-block', margin: '0 10px'}}onClick={() => history.push("/home")}>Back to Home Page </Button>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
    </div><div></div></div></div>);};

export default Lobby;