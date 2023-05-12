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
    <div className="home button-container">
      <Button
        style={{ fontSize: "45px", width: "25%", height: "100px" }}
        onClick={() => history.push("/lobby")}
      >
        Start Game
      </Button>
      <Button
        style={{ fontSize: "45px", width: "25%", height: "100px" }}
        onClick={() => history.push("/home/scoreboard")}
      >
        Score Board
      </Button>
      <Button
        style={{ fontSize: "45px", width: "25%", height: "100px" }}
        onClick={() => history.push("/home/history")}
      >
        Game Statistics
      </Button>
      <Button
        style={{ fontSize: "45px", width: "25%", height: "100px" }}
        onClick={() => goProfile(localStorage.getItem("userId"))}
      >
        My Profile
      </Button>
      <Button
        style={{
          fontSize: "45px",
          width: "25%",
          height: "100px",
          marginTop: "40px",
        }}
        onClick={() => doLogout()}
      >
        Logout
      </Button>
      <ToastContainer />
    </div>
  );
};

export default Home;
