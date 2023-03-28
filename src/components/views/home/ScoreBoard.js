import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
// import { moment } from "moment";
import BaseContainer from "components/ui/BaseContainer";
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
  const [users, setUsers] = useState(null);

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

  const Users = ({ user }) => (
    <div className="user container">
      <div className="user user-link">
        <Button onClick={() => goProfile(user.userId)}>{user.username}</Button>
        <div className="user user-info">ID: {user.userId}</div>
      </div>
      <div className="user user-info">Status: {user.status}</div>
    </div>
  );
  Users.propTypes = {
    user: PropTypes.object,
  };

  let userlist = <Spinner />;

  if (users) {
    userlist = (
      <ul>{users.map((user) => (
          <Users user={user} key={user.userId} />
        ))}
      </ul>
    );
  }

  return (
    <BaseContainer className="scoreboard container">
      <h2>Score Board</h2>
      <div className="scoreboard user-list">{userlist}</div>
      <div>
        <Button width="150%" onClick={() => history.push("/home")}>
          Return
        </Button>
      </div>
    </BaseContainer>
  );
};

export default ScoreBoard;
