import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Button } from "components/ui/Button";
import "styles/views/home/Home.scss";
import { useEffect } from "react";

import connect from "utils/socket";

const Home = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    useEffect(() => {
        connect(localStorage.getItem("username"));
    }, [])

    const doLogout = async () => {
        try {
            const username = localStorage.getItem("username");
            const requestBody = JSON.stringify({ username });
            await api.put("/logout", requestBody);
        } catch (error) {
            alert(`An error occurs during the login: \n${handleError(error)}`);
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
                onClick={() => goProfile(localStorage.getItem("userId"))}
            >
                My Profile
            </Button>
            <Button
                style={{ fontSize: "45px", width: "25%", height: "100px" }}
                onClick={() => history.push("/home/scoreboard")}
            >
                RANK
            </Button>
            <Button
                style={{ fontSize: "45px", width: "25%", height: "100px" }}
                onClick={() => history.push("/home/history")}
            >
                HISTORY
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
        </div>
    );
};

export default Home;
