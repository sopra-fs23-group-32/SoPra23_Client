import { useHistory } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from 'react-switch';
import "styles/views/home/Lobby.scss";
import { FaCopy } from 'react-icons/fa';



const Lobby = () => {
  const [url, setUrl] = useState('');
  const [clicked, setClicked] = useState(false);

  localStorage.removeItem("roundNumber");
  localStorage.setItem("roundNumber", 1);
  const [userName, setUsername] = useState('');
  const [gameId, setGameId] = useState(0);
  const [inviteLink, setInviteLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [targetPlayerNumber, setTargetPlayerNumber] = useState();

  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [isMultiplayer, setIsMultiplayer] = useState(true);
  const handleToggle = () => {setIsMultiplayer(!isMultiplayer);};
  const [gameRounds, setGameRounds] = useState(null);
  const [countdownTime, setCountdownTime] = useState(null);


  function checkLobbyUrl(url) {
    if (url.endsWith('/lobby')) {
      console.log('Lobby Page');
      return true;

    } else {
      console.log('Invite Link page');
      return false;
    }
  }

  


  

  const setLocalStorageItems = (question) => {
    const cityNamesString = JSON.stringify([question.option1, question.option2, question.option3, question.option4]);
    localStorage.setItem("citynames2", cityNamesString);
    localStorage.setItem("PictureUrl", question.pictureUrl);
    localStorage.setItem("CorrectOption", question.correctOption);
  };


  const getGameState = async (gameId) => {
    try {
      const response = await api.get(`/gamestatus/${gameId}`);
      const gameStatus = response.data;
      return gameStatus;
    } catch (error) {
      throw error;
    }
  };
  


  const joinMultiPlayerGame =()=>{
    const url = window.location.href;
    const isLobbyPage = checkLobbyUrl(url); 
    console.log("IS lobby",isLobbyPage);
    console.log(url);
    const lastSlashIndex = url.lastIndexOf("/");

    if (lastSlashIndex !== -1) {
      const lastPart = url.substring(lastSlashIndex + 1);
      console.log(lastPart); // does not execute
      console.log("game_id: ",parseInt(lastPart));
      localStorage.setItem("gameId2",parseInt(lastPart))
    
    } else {
      console.log("No slashes found in URL");
    }
    
    if (!isLobbyPage) {
      localStorage.setItem("gameId",localStorage.getItem("gameId2"));
    }  
    console.log("reached");
    console.log("gameid joinm: ",gameId);
      if (1==1) {
        setClicked(true);
        handleAddPlayer(localStorage.getItem("userId"));
      }
    };

    

  const generateLink = () => {
    setLobbyLink(`http://localhost:3002/lobby/${localStorage.getItem('gameId')}`);
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
  
    const redirectToGamePage = (gameId) => {
        setTimeout(() => {
        history.push(`/gamePage/${gameId}`);
      }, 1000);
    };
    
   
    const createGame=async (category, gameRounds, gameDuration) => {
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
      console.log("gameid here: ",gameId)
      localStorage.setItem("gameId", gameId);
      console.log("gameid here: ",localStorage.getItem("gameId"));

      const playerId2=localStorage.getItem("userId");
      localStorage.setItem("targetPlayerNumber",targetPlayerNumber);

      localStorage.setItem("score",0);
      console.log("Id from logged in payer: ",playerId2);
      handleAddPlayer(playerId2);
      console.log("create game: ", response);

    } catch (error) {
      alert(`Something went wrong during game start: \n${handleError(error)}`);
    }
  };
  
  


  const startGameSingleplayer = async (category, gameRounds, gameDuration) => {
    try {
      fetchQuestion(localStorage.getItem('gameId'));
      
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
  
  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;
    setTargetPlayerNumber(selectedValue);
  };




const handleUsernameChange = (event) => {
  setUsername(event.target.value);
};

const handleAddPlayerToGame= async () => {
  try {
    console.log("Username is: ",userName);
    const gameId=localStorage.getItem("gameId");
    const response = await api.get(`/user/${userName}`);
    console.log('Player userId is: ', response.data);
    handleAddPlayer(response.data);

  } catch (error) {
    console.error('Error trying to get userid', error);
  }
};


const getGamePlayers = async (gameId) => {
  const response = await api.get(`/games/${gameId}/players`);
  const players = response.data; // extract the players from the response
  console.log("Players in game: ",players.length);
  return players.length; // return the length of the players array

};




const handleAddPlayer = async (playerId) => {
  try {
    const gameId=localStorage.getItem("gameId");
    console.log("gameid for adding muk", gameId);
    const response = await api.post(`/games/${gameId}/players/${playerId}`);
    console.log('Player added successfully', response);
  } catch (error) {
    console.error('Error adding player', error);
  }
};


async function fetchQuestions() {
  const response = await api.get(`/games/${localStorage.getItem("gameId")}/questions`);
  console.log("Response: ",response);
  const question = response.data;
  setLocalStorageItems(question);
  console.log("Questions: ",question);
}


const startGameMultiplayer = async (gameId) => {
  let gameState = '';
  const url = window.location.href;
  const lastSlashIndex = url.lastIndexOf("/");
if (lastSlashIndex !== -1) {
  const lastPart = url.substring(lastSlashIndex + 1);
  console.log(lastPart); // does not execute
  console.log("game_id: ",parseInt(lastPart));
  localStorage.setItem("gameId2",parseInt(lastPart))

} else {
  console.log("No slashes found in URL");
}
  const isLobbyPage = checkLobbyUrl(url); 
  if (!isLobbyPage) {
    localStorage.setItem("gameId",localStorage.getItem("gameId2"));
    gameState = await getGameState(localStorage.getItem("gameId"));
    localStorage.setItem("score",0);
    const playerId2=localStorage.getItem("userId");
    console.log("Id from logged in payer: ",playerId2);

    if (gameState === 'ANSWERING') {
      fetchQuestions();
      redirectToGamePage(gameId);
    } else {
      console.log('Game is not yet started');
    }

  } else {
    await fetchQuestion(gameId);
    localStorage.setItem("score",0);
    setTimeout(() => {
      history.push(`/gamePage/${gameId}`);
    }, 1000);
  }
};


  const handleCopyLink = () => {
    navigator.clipboard.writeText(lobbyLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000); // Reset copied status after 2 seconds
  };

  const [lobbyLink, setLobbyLink] = useState('');




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
          </label>

          <label className="lobby label">
        Enter Number of Players for Game:
        <select
          className="lobby input"
          style={{ marginLeft: "20px", textAlign: "center", color: "black", fontSize: "16px", padding: "5px" }}
          value={targetPlayerNumber}
          onChange={handleSelectChange}
        >
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
          <option value={6}>6</option>
        </select>
      </label>
    </div>



          <div><label className="lobby label">
            Enter Round Duration:
                <input className="lobby input" 
                  style={{marginLeft:"10px", textAlign:"center"}}
                  placeholder="enter round duration..."
                  value={countdownTime}
                  onChange={e => setCountdownTime(e.target.value)}
                />
          </label></div>

          <div className="lobby label">
      <button className="lobby button" onClick={generateLink}>
        Generate Lobby Link
      </button>
      {lobbyLink && (
        <div className="lobby label">
          Lobby Link:
          <input
            type="text"
            className="lobby input"
            style={{ marginLeft: '10px', textAlign: 'center' }}
            value={lobbyLink}
            readOnly
          />
          <FaCopy
            className="lobby icon"
            onClick={handleCopyLink}
            style={{ marginLeft: '10px', cursor: 'pointer' }}
          />
          {isCopied && <span className="lobby label">Copied!</span>}
        </div>
      )}
    </div>
  
        </InformationContainer>

        <InformationContainer className="lobby container_right" 
        style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '20px', marginBottom: '20px'}}>
            <div>Users in the lobby:</div>
          </p>
         
        </InformationContainer>
      </div>
    <div className="lobby buttons">
    <Button style={{ display: 'inline-block', margin: '0 10px' }} onClick={()=>createGame(selectedCategory,gameRounds,30)}>Create Game</Button>
    <Button style={{display: 'inline-block', margin: '0 10px'}}onClick={()=>fetchQuestions()}>Fetch Questions</Button>
    <Button style={{ display: 'inline-block', margin: '0 10px' }}onClick={() => isMultiplayer ? startGameMultiplayer(localStorage.getItem("gameId")) : startGameSingleplayer(selectedCategory,gameRounds,countdownTime)}>Start Game</Button>
    <Button style={{ display: 'inline-block', margin: '0 10px' }}onClick={() =>joinMultiPlayerGame()}>Join Multiplayer Game</Button>

    <Button style={{display: 'inline-block', margin: '0 10px'}}onClick={() => history.push("/home")}>Back to Home Page </Button>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
    </div><div></div></div></div>);};

export default Lobby;