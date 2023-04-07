import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
// import { moment } from "moment";
import PropTypes from "prop-types";

import "styles/views/home/ScoreBoard.scss";

const ScoreBoard = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState([]);

  const goProfile = (profileId) => {
    localStorage.setItem("profileId", profileId);
    history.push("/home/profile")
  };

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get("/users");

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);
        console.log(response);
      } catch (error) {
        console.error(
          `An error occurs while fetching the users: \n${handleError(error)}`
        );
        console.error("Details:", error);
        alert(
          "Something went wrong while fetching the users! See the console for details."
        );
      }
    }
    fetchData();
  }, []);


// remove this part if the backend returns already ranked users
  //  sort the users array in descending order of their scores
  const sortedUsers = users.sort((a, b) => b.totalScore - a.totalScore);
  // assign each user a ranking ID based on their position in the array
  const rankedUsers = sortedUsers.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));


    const Users = ({ users }) => (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>RANK</th>
                <th>USERNAME</th>
                <th>TOTAL SCORE</th>
                <th>GAME NUMBER</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
                {users.map((user, index) => (
                <tr className={index % 2 !== 0 ? "odd" : "even"} key={user.id} onClick={() => goProfile(user.userId)}>
                  <td style={{ width: "10%", textAlign: "center" }}>{user.rank}</td>
                  <td style={{ width: "20%", textAlign: "center" }}>{user.username}</td>
                  <td style={{ width: "10%", textAlign: "center" }}>{user.totalScore}</td>
                  <td style={{ width: "10%", textAlign: "center" }}>{user.totalGameNum}</td>
                  <td style={{ width: "15%", textAlign: "center" }}>{user.status}</td>
                </tr>
                ))}
            </tbody>
          </table>
        </div>
    );

    Users.propTypes = {
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
      <br></br>
      {userlist}
      <br></br>
      <div>
        <Button width="150%" onClick={() => history.push("/home")}>
          Return
        </Button>
      </div>
    </div>
  );
};

export default ScoreBoard;
