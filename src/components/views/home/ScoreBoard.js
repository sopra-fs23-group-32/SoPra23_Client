import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";

import "styles/views/home/ScoreBoard.scss";

const ScoreBoard = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  const [userRanking, setUserRanking] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("WORLD");

  const goProfile = (profileId) => {
    localStorage.setItem("profileId", profileId);
    history.push("/home/profile")
  };

  useEffect(() => {
    async function fetchData() {
      try {
        let urlCategory;
        if(selectedCategory === "WORLD") {
          urlCategory = "/users/ranking";
        }
        else {
          urlCategory = "/users/ranking?category=" + selectedCategory;
        }
        const response = await api.get(urlCategory);
        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Get the returned users and update the state.
        setUserRanking(response.data);
        console.log(response);
      } catch (error) {
        console.error(
          `An error occurs while fetching the userRanking: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert("Something went wrong while fetching the userRanking.");
      }
    }
    fetchData();
  }, []);

  const Users = ({ user }) => (
    <div className="user user-info">
      {user.userId} - {user.username}
    </div>
  );
  Users.propTypes = {
    users: PropTypes.object,
  };
  
const users=["max","maria"]
// remove this part if the backend returns already ranked users
  //  sort the users array in descending order of their scores
  const sortedUsers = users.sort((a, b) => b.totalScore - a.totalScore);
  // assign each user a ranking ID based on their position in the array
  const rankedUsers = sortedUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));

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
          <tr className={index % 2 !== 0 ? "odd" : "even"} key={user.userId} onClick={() => goProfile(user.userId)}>
            <td style={{ width: "8%", textAlign: "center" }}>{user.rank}</td>
            <td style={{ width: "22%", textAlign: "center" }}>{user.username}</td>
            <td style={{ width: "20%", textAlign: "center" }}>{user.score}</td>
            <td style={{ width: "20%", textAlign: "center" }}>{user.gameNum}</td>
            <td style={{ width: "20%", textAlign: "center" }}>{new Date(user.createDay).toISOString().slice(0,10)}</td>
          </tr>
          ))}
      </tbody>
    </table>
  );
  UserRanking.propTypes = {
    user: PropTypes.object,
  };

  let userlist = <Spinner />;

  if (users) {
    userlist = (
      <Users users={rankedUsers} />
    );
  }

  return (
    <div className="scoreboard container">
      <h2>Score Board</h2>
      <div><label className="scoreboard label">
        <label>Pick a city category:</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            <option value="WORLD">All</option>
            <option value="AFRICA">Africa</option>
            <option value="ASIA">Asia</option>
            <option value="EUROPE">Europe</option>
            <option value="NORTH_AMERICA">North America</option>
            <option value="OCEANIA">Oceania</option>
            <option value="SOUTH_AMERICA">South America</option>
          </select>
      </label></div>
      <div>{rankedUsers}</div>
      <div className="scoreboard button-container">
        <Button width="300%" onClick={() => history.push("/home")}>
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default ScoreBoard;
