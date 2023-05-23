import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import { InputLabel, Select, MenuItem, TextField } from "@mui/material";
import PropTypes from "prop-types";
import InformationContainer from "components/ui/BaseContainer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/views/home/ScoreBoard.scss";


const ScoreBoard = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();
    const [userRanking, setUserRanking] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("WORLD");

    const goProfile = (profileId) => {
        localStorage.setItem("profileId", profileId);
        history.push("/home/profile");
    };

    useEffect(() => {
        async function fetchData() {
            try {
                let urlCategory;
                if (selectedCategory === "WORLD") {
                    urlCategory = "/users/ranking";
                } else {
                    urlCategory = "/users/ranking?category=" + selectedCategory;
                }
                const response = await api.get(urlCategory);
                // This is just a fake async call, so that the spinner can be displayed
                await new Promise((resolve) => setTimeout(resolve, 1000));
                // Get the returned users and update the state.
                setUserRanking(response.data);
                console.log(response);
            } catch (error) {
                toast.error(`${error.response.data.message}`);
                console.log(handleError(error));
            }
        }
        fetchData();
    }, [selectedCategory]);

    const UserRanking = ({ userRanking }) => (
        <table className="table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th>Score</th>
                    <th>Number of Games</th>
                    <th>Date created</th>
                </tr>
            </thead>
            <tbody>
                {userRanking.map((user, index) => (
                    <tr
                        className={index % 2 !== 0 ? "odd" : "even"}
                        key={user.userId}
                        onClick={() => goProfile(user.userId)}
                    >
                        <td style={{ width: "8%" }}>{user.rank}</td>
                        <td style={{ width: "22%" }}>{user.username}</td>
                        <td style={{ width: "20%" }}>{user.score}</td>
                        <td style={{ width: "20%" }}>{user.gameNum}</td>
                        <td style={{ width: "20%" }}>
                            {new Date(user.createDay)
                                .toISOString()
                                .slice(0, 10)}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
    UserRanking.propTypes = {
        user: PropTypes.object,
    };

    let sortedUserList = <Spinner />;

    if (userRanking !== null) {
        sortedUserList = <UserRanking userRanking={userRanking} />;
    } else {
        sortedUserList = <Spinner />;
    }

    return (
        <div
            className="Scoreboard container"
            style={{ flexDirection: "column" }}
        >
            <InformationContainer
                className="scoreboard container"
                style={{ fontSize: "48px", width: "fit-content" }}
            >
                Leaderboard
            </InformationContainer>
            <InformationContainer
                className="profile container"
                style={{ width: "fit-content" }}
            >
                <div
                    className="scoreboard label"
                    style={{ alignItems: "baseline" }}
                >
                    <InputLabel className="scoreboard label">
                        Pick a city category:
                    </InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={selectedCategory}
                        style={{ height: "45px", marginBottom: "16px" }}
                        label="category"
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        inputProps={{
                            MenuProps: {
                                sx: { borderRadius: "10px" },
                                MenuListProps: {
                                    sx: {
                                        backgroundColor: "rgba(65, 63, 240, 0.7)",
                                        color: "white",
                                    },
                                },
                            },
                        }}
                        className="lobby category"
                    >
                        <MenuItem value={"EUROPE"}>Europe</MenuItem>
                        <MenuItem value={"ASIA"}>Asia</MenuItem>
                        <MenuItem value={"NORTH_AMERICA"}>North America</MenuItem>
                        <MenuItem value={"SOUTH_AMERICA"}>South America</MenuItem>
                        <MenuItem value={"AFRICA"}>Africa</MenuItem>
                        <MenuItem value={"OCEANIA"}>Oceania</MenuItem>
                        <MenuItem value={"WORLD"}>All</MenuItem>
                    </Select>
                </div>

                <div>{sortedUserList}</div>
                <div className="scoreboard button-container">
                    <Button width="300%" onClick={() => history.push("/home")}>
                        Return to Home
                    </Button>
                </div>
            </InformationContainer>
            <ToastContainer />
        </div>
    );
};

export default ScoreBoard;