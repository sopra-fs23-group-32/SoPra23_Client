import { useHistory } from "react-router-dom";
import React, {useState, useEffect} from 'react';
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import Switch from 'react-switch';
import PropTypes from "prop-types";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

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
  const [setSelectedCategory] = useState('Europe');
  const [gameRounds, setGameRounds] = useState(null);

  const [players, setPlayers] = useState(null);
  const [populationThreshold, setPopulationThreshold] = useState(2000000);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
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
  const getRandomCities = async () => {
    const response = await api.get('/random-cities', {
      params: {
        category: setSelectedCategory,
        populationThreshold: populationThreshold,
      },
    });
    localStorage.setItem('randomcities', JSON.stringify(response.data));
    const rightCity=response.data[0];
    localStorage.setItem("rightCity",rightCity);
    console.log("Right City: ", localStorage.getItem('rightCity'));
    console.log("RANDOM CITIES: ", localStorage.getItem('randomcities'));


  };
  function show_image(src, width, height, alt) {
    var img = document.createElement("img");
    img.src = src;
    img.width = width;
    img.height = height;
    img.alt = alt;

    // This next line will just add it to the <body> tag
    document.body.appendChild(img);
}

  const displayCityImage = async (cityName) => {
    try {
        const response = await api.post('/city-image', { cityName: cityName });
        const imageUrl = response.data;
        localStorage.setItem("imageUrl",imageUrl);
        show_image(imageUrl,100,100,cityName);
        console.log('imageUrl:', imageUrl);
        return imageUrl;
    } catch (error) {
        console.log('Error saving city image:', error);
        return '';
    }
};

const startNewGame = async (rounds, countdownTime, category, populationThreshold) => {
  try {
    const response = await api.post('/start/singlemode', {
      rounds: 4,
      countdownTime: 4,
      category: 'Europe',
      populationThreshold: 2000000
    });
    const game = response.data;
    console.log('game:', game);
    return game;
  } catch (error) {
    console.log('Error starting new game:', error);
    return null;
  }
};


const startSingleModeGame = async (player,rounds, countdownTime, category, populationThreshold) => {
  try {
    console.log("Player: ",player,"Rounds: ",rounds, "countdownTime: ",countdownTime, "category: ",category,"populationsmin: ",populationThreshold)
    const response = await api.post('/singlemode/start', {
      player:player,
      rounds: rounds,
      countdownTime: 30,
      category: category,
      populationThreshold: 200000,
    });
    const game = response.data;
    console.log('New single mode game started:', game);
    localStorage.setItem("SingleModeGame_id",game.getId)
  } catch (error) {
    console.log('Error starting single mode game:', error);
  }
  history.push("/GamePage")
}





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
              <select name="selectedFruit"
              style={{marginLeft:"10px", textAlign:"center"}}
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
          onClick={() => handleOpen()}>
          Invite to Game
        </Button>
        <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box color="primary" sx={style}>
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  Copy this link....:
                </Typography>
              </Box>
            </Modal>

        

        <Button style={{ display: 'inline-block', margin: '0 10px' }}
          disabled={isMultiplayer}
          onClick={() => startSingleModeGame(localStorage.getItem('userId'),gameRounds,30,setSelectedCategory,populationThreshold)}>
          Start Single Mode Game
        </Button>

        <Button style={{ display: 'inline-block', margin: '0 10px' }}
          disabled={!isMultiplayer}
          onClick={() => startNewGame(gameRounds,30,setSelectedCategory,populationThreshold)}>
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
