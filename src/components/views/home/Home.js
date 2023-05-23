import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
// import { moment } from "moment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "styles/views/home/Home.scss";

const Home = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const doLogout = async () => {
    try {
      const username = localStorage.getItem("username");
      const requestBody = JSON.stringify({ username });
      await api.put("/logout", requestBody);
    } catch (error) {
//      alert(`An error occurs during the login: \n${handleError(error)}`);
        toast.error(`${error.response.data.message}`);
        console.log(handleError(error));
    }

    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    history.push("/login");
  };

  const goProfile = (profileId) => {
    localStorage.setItem("profileId", profileId);
    history.push("/home/profile");
  };

  return (
  <div className="page-container">
    <div className="home button-container">
      <Button style={{ fontSize: "2.5rem", width: "40rem", height: "auto" }}
        onClick={() => history.push("/lobby/singleplayer")}>
        Start Singleplayer Game
      </Button>

      <Button style={{ fontSize: "2.5rem", width: "40rem", height: "auto" }}
          onClick={() => history.push("/lobby/multiplayer")}>
        Create Multiplayer Game
      </Button>

      <Button style={{ fontSize: "2.5rem", width: "40rem", height: "auto" }}
          onClick={() => history.push("/JoinGame")}>
        Join Multiplayer Game
      </Button>

      <Button style={{ fontSize: "2.5rem", width: "40rem", height: "auto" }}
        onClick={() => history.push("/home/scoreboard")}>
        Leaderboard
      </Button>
      <Button style={{ fontSize: "2.5rem", width: "40rem", height: "auto" }}
        onClick={() => history.push("/userinfo/history")}>
        Game History
      </Button>
      <Button style={{ fontSize: "2.5rem", width: "40rem", height: "auto" }}
        onClick={() => goProfile(localStorage.getItem("userId"))}>
        My Profile
      </Button>
      <Button style={{ fontSize: "2.5rem", width: "40rem", height: "auto" }}
        onClick={() => history.push("/home/about")}>
        About
      </Button>
      <Button style={{ fontSize: "2.5rem", width: "40rem", height: "auto" }}
        onClick={() => doLogout()}>
        Logout
      </Button>
      <ToastContainer />
    </div>
  </div>
  );
};

export default Home;
