import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
// import { moment } from "moment";
import BaseContainer from "components/ui/BaseContainer";

import "styles/views/home/Home.scss";

const Home = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const doLogout = async () => {
    try {
      const username = localStorage.getItem("username")
      const requestBody = JSON.stringify({username});
      await api.put("/logout", requestBody);
    }
    catch (error) {
      alert(`An error occurs during the login: \n${handleError(error)}`);
    }

    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    history.push("/login");
  };

  const goProfile = (profileId) => {
    localStorage.setItem("profileId", profileId);
    history.push("/home/profile")
  };

  return (
      <div className="home button-container">
        <Button style={{fontSize: '45px', width : '40%' }} onClick={() => history.push("/lobby")}>
          Start Game
        </Button>
        <Button style={{ width: '15%' }} onClick={() => history.push("/home/scoreboard")}>
          Score Board
        </Button>
        <Button style={{ width: '15%' }}>
          Game Statistics
        </Button>
        <Button style={{ width: '15%' }} onClick={() => goProfile(localStorage.getItem("userId"))}>
          My Profile
        </Button>
        <Button style={{ width: '15%' }} onClick={() => doLogout()}>
          Logout
        </Button>
        </div>
  );
};

export default Home;
