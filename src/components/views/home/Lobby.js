import { useHistory } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from 'react-switch';
import PropTypes from "prop-types";
import CityCategory from "models/CityCategory"
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
  const [gameRounds, setGameRounds] = useState(null);
  const [gameDuration, setGameDuration] = useState(100);
  const [players, setPlayers] = useState(null);

  const [option1, setOption1]=useState("");
  const [option2, setOption2]=useState("");
  const [option3, setOption3]=useState("");
  const [option4, setOption4]=useState("");
  const [pictureUrl, setPictureUrl]=useState("");
  const [correctOption, setCorrectOption]=useState("");
  const [score, setScore]=useState("");
  const [roundNumber, setRoundNumber]=useState(0);

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


  const getGameDetails = async (gameId) => {
    try {
      console.log("before call");
      const response = await api.put(`/games/${gameId}`);
      const question = response.data;
      console.log("question otpion1", question.option1);
      console.log("Option1: ",option1, "Option2: ",option2,"Option3: ",option3, "Option4: ",option4)

      const cityNamesString = JSON.stringify([question.option1, question.option2, question.option3, question.option4]);
      console.log("CityNameString: ", cityNamesString);
      localStorage.setItem("citynames2", cityNamesString);
      localStorage.setItem("PictureUrl",question.pictureUrl);
      localStorage.setItem("CorrectOption",question.correctOption);

      return question;
    } catch (error) {
      throw error;
    }
  };
  
  const startGame = async (category, gameRounds, gameDuration) => {
    try {
      let category_uppercase;
      category_uppercase = category.toUpperCase();
  
      // create a new game
      const requestBody = {
        category: category_uppercase,
        totalRounds: gameRounds,
        countdownTime: gameDuration,
      };
      console.log("REQUEST BODY: ", requestBody);
      const response = await api.post("/games", requestBody);
  
      const gameId = response.data.gameId;
      localStorage.setItem("gameId",gameId);
      console.log("GAME RETURN: ", response);
      await getGameDetails(gameId);
      history.push(`/gamePage/${gameId}`);
    } catch (error) {
      alert(`Something went wrong during game start: \n${handleError(error)}`);
    }
  };
  

  
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
          <div>
          <label className="lobby label">
              Pick a city category:
              <select name="selectedCategory2"
              style={{marginLeft:"10px", textAlign:"center"}}
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}>
                <option value="Europe">Europe</option>
                <option value="Asia">Asia</option>
                <option value="North America">North America</option>
                <option value="South America">South America</option>
                <option value="Africa">Africa</option>
                <option value="Oceania">Oceania</option>
                <option value="World">World</option>
              </select>
            </label>
          </div>
          <div>
            <label className="lobby label">
                Enter Number of Rounds:
                <input className="lobby input" 
                  style={{marginLeft:"10px", textAlign:"center"}}
                  placeholder="enter number of rounds..."
                  value={gameRounds}
                  onChange={e => setGameRounds(e.target.value)}
                />
            </label>
          </div>
        </InformationContainer>

        <InformationContainer className="lobby container_right" 
        style={{ display: 'flex', flexDirection: 'column' }}>
          <p style={{ fontSize: '20px', marginBottom: '20px'}}>
            <div>Users in the lobby:</div>
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
          disabled={isMultiplayer}
          onClick={() => startGame(selectedCategory,gameRounds,30)}>
          Start Single Mode Game
        </Button>

        <Button style={{ display: 'inline-block', margin: '0 10px' }}
          disabled={!isMultiplayer}
          onClick={() => startGame(selectedCategory,gameRounds,30)}>
          Start Multiplayer Mode Game
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
