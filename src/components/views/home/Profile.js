import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

import "styles/views/home/Profile.scss";

const FormField = (props) => {
  return (
    <div className="profile field">
      <label className="profile label">{props.label}</label>
      <input
        className="profile input"
        type={props.input_type}
        placeholder="enter here.."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
};
FormField.propTypes = {
  label: PropTypes.string,
  input_type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Profile = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  const [userProfile, setUserProfile] = useState(null);
  const [username, setUsername] = useState(null);
  const [birthDay, setBirthDay] = useState(null);

    const changeProfile = async () => {
        try {
            let requestBody;
            if(username === null){
              let username = localStorage.getItem("username");
            requestBody = JSON.stringify({ username, birthDay });
            }
            else{
              requestBody = JSON.stringify({ username, birthDay });
            }
            const userURL = "/users/" + localStorage.getItem("userId");
            await api.put(userURL, requestBody);
        } catch (error) {
            alert(
                `Your new username is occupied, choose another one.\n${handleError(error)}`
            );
        }
        window.location.reload();
    };

  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const userURL = "/users/" + localStorage.getItem("profileId");
        const response = await api.get(userURL);
        // const response = await api.get("/users/1");

        // delays continuous execution of an async operation for 1 s
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUserProfile(response.data);

        // console.log("request to:", response.request.responseURL);
        // console.log("status code:", response.status);
        // console.log("status text:", response.statusText);
        // console.log("requested data:", response.data);
        // See here to get more data.
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

  const Profile = ({ user }) => (
    <div className="user container">
      <div className="user user-info">User Name: {user.username}</div>
      <div className="user user-info">Status: {user.status}</div>
      <div className="user user-info">
        Created in: {new Date(user.createDay).toDateString()}
      </div>
      <div className="user user-info">
        Birthday: {new Date(user.birthDay).toDateString()}
      </div>
    </div>
  );
  Profile.propTypes = {
    user: PropTypes.object,
  };

  let content = <Spinner />;

  if (userProfile) {
    if (localStorage.getItem("profileId") === localStorage.getItem("userId")) {
        content = (
          <div className="profile">
            <Profile user={userProfile} />
            <FormField
              label="Change username"
              input_type="text"
              value={username}
              onChange={un => setUsername(un)}
            />
            <FormField
              label="Set birthday"
              input_type="date"
              value={birthDay}
              onChange={bd => setBirthDay(bd)}
            />
            <div className="profile button-container">
              <Button
                width="80%"
                disabled={!username && !birthDay}
                onClick={() => changeProfile()}
              >
                Save Change
              </Button>
              <Button width="80%" onClick={() => history.push("/home")}>
                Return to Home
              </Button>
            </div>
          </div>
        );
      }
    else{
        content = (
          <div className="profile">
            <Profile user={userProfile} />
            <div className="profile button-container">
              <Button width="80%"
                onClick={() => {
                  localStorage.removeItem("profileId");
                  history.push("/home");
                }}
              >
                Return to Home
              </Button>
            </div>
          </div>
        );
    }
  }

  return (
    <BaseContainer className="profile container">
      <h2>User Profile</h2>
      {content}
    </BaseContainer>
  );
};

export default Profile;
