import { useHistory } from "react-router-dom";
import { Button } from "components/ui/Button";
import 'react-toastify/dist/ReactToastify.css';
import InformationContainer from "components/ui/BaseContainer";
import "styles/views/home/About.scss";

const About = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();


  const aboutText = "Welcome to Guess the City! Get ready to embark on an exciting journey that will put your geography knowledge to the test, while discovering the diverse beauty of cities around the world. Whether you prefer solo exploration or friendly competition with your friends, this game is designed to provide hours of engaging entertainment!"

  const gameInfo = "In each round of Guess the City!, you'll be presented with a captivating picture of a city. Your task? Identify the correct city name from a set of four options. But beware, time is ticking! You'll need to think quickly and trust your instincts to make the right choice before the clock runs out. Prepare for the moment of truth as the solution is revealed. And if you guessed correctly, congratulations! You'll earn lots of points. Remember, the quicker you respond with the correct answer, the more points you'll earn!"

  const leaderboard = "Every game you play is carefully recorded in the Game History, allowing you to revisit your past adventures and marvel at your progress. If you're up for an extra thrill, engage in multiplayer games and compete on the global leaderboard. See how your skills measure up against other players from around the world. Will you climb to the top and become a true city connoisseur?"
  
  const journey = "Get ready to expand your geography knowledge, sharpen your instincts, and uncover the wonders of cities with Guess the City! It's time to embrace the challenge and embark on a remarkable virtual tour. Let the journey begin!"



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
        <InformationContainer className="about text-container">
            {journey}
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
