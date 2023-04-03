import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import InformationContainer from "components/ui/BaseContainer";
import Switch from 'react-switch';
import React, {useState} from 'react';


import "styles/views/home/Lobby.scss";

const Lobby = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [isMultiplayer, setIsMultiplayer] = useState(true);

  const handleToggle = () => {
    setIsMultiplayer(!isMultiplayer);
  };  

  return (
    <div>
      <InformationContainer className="lobby container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }} className="lobby button-container">
        Game Settings
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '10px' }}>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '18px' }}>Singleplayer</span>
        </div>
        <div>
          <Switch checked={isMultiplayer}
          onChange={handleToggle}
          trackColor={{true: 'red', false: '#1979b8'}}
          disableRipple
          checkedIcon={false}
          uncheckedIcon={false} />
        </div>
        <div>
          <span style={{ fontSize: '18px' }}>Multiplayer</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        Choose Category
        <Button>Choose here...</Button>
      </div>

    </InformationContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
          <Button style={{ display: 'inline-block', margin: '0 10px'}} disabled={!isMultiplayer} onClick={() => history.push("/home")}>
          
          Invite to Game
          </Button>
          <Button style={{ display: 'inline-block', margin: '0 10px' }} onClick={() => history.push("/home")}>
          Start Game
          </Button>
        </div>
      <div>
        <Button style={{display: "block", margin: "auto"}} onClick={() => history.push("/home")}>
        Back to Home Page 
        </Button>
      </div>
    </div>

  );
  
};
export default Lobby;
