import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import 'react-toastify/dist/ReactToastify.css';
import InformationContainer from "components/ui/BaseContainer";
import "styles/views/game/About.scss";

const About = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const aboutText = "Guess the City! is a game where you can test and improve your geography knowledge and learn what cities look like all over the world. You can play this game alone with your friends, the choice is yours."
  const gameInfo = "In each round of Guess the City! you will be shown a picture of a city along with 4 possible answers out of which one is the corresponding city name. Be aware, you only have a limited amount of time to answer! After the timer runs out you'll be presented the solution, and if you guessed correctly, you'll be awarded points. The faster you choose the correct answer, the more points you'll get."

  const leaderboard = "Each game you play is archived and you can view the games you played in the Game History. Multiplayer games additionally count towards a global leaderboard, where you can see how well you performed compared to others"
  



  return (
    <div className="About container" style={{flexDirection: "column"}}>
        <InformationContainer className="about container" style={{fontSize: '48px', width: "fit-content"}}>
            About
        </InformationContainer>
        <InformationContainer className="about text-container" >
            {aboutText}
        </InformationContainer>
        <InformationContainer className="about text-container">
            {gameInfo}
        </InformationContainer>
        <InformationContainer className="about text-container">
            {leaderboard}
        </InformationContainer>
      <Button className="about button-container"
        onClick={() => history.push("/home")}
      >
        Back to Home Page
      </Button>
    </div>
  );
};

export default About;
