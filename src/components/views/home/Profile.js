import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

import "styles/views/home/Profile.scss";


const Profile = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();
  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  const [userProfile, setUserProfile] = useState(null);
  const [username, setUsername] = useState(null);
  const [birthDay, setBirthDay] = useState(null);
  const [oldPwd, setOldPwd] = useState(null);
  const [newPwd, setNewPwd] = useState(null);

  const changeProfile = async () => {
      if(oldPwd !== null && oldPwd !== userProfile.password) {
        alert(`Your old password is wrong, try again.\n`);
      }
      try {
          let requestBody;
          if(username === null) {
            let username = localStorage.getItem("username");
            requestBody = JSON.stringify({ username, newPwd, birthDay });
          }
          else{
            requestBody = JSON.stringify({ username, newPwd, birthDay });
          }
          const userURL = "/users/" + localStorage.getItem("userId");
          await api.put(userURL, requestBody);
      } catch (error) {
          alert(`Your new username is occupied, choose another one.\n${handleError(error)}`);
      }
      window.location.reload();
    };


  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const userURL = "/users/" + localStorage.getItem("profileId");
        const response = await api.get(userURL);

        // delays continuous execution of an async operation for 1 s
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUserProfile(response.data);

        console.log(response);
      } catch (error) {
        console.error(
          `An error occurs while fetching the user: \n${handleError(error)}`
        );
        alert(
          `Something went wrong while fetching the user: \n${handleError(error)}`
        );
      }
    }
    fetchData();
  }, []);

  const Profile = ({ user }) => (
    <div className="user-profile">
      <div className="user-profile-field">
        <label>Username</label>
        {localStorage.getItem("profileId") === localStorage.getItem("userId") ? (
          <>
             <div>{user.username}</div>
             <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </>
        ) : (
            <div>{user.username}</div>
        )}
      </div>
      <div className="user-profile-field">
        <label>Status</label>
        <div>{user.status}</div>
      </div>
      <div className="user-profile-field">
        <label>Created on</label>
        <div>{new Date(user.createDay).toISOString().slice(0, 10)}</div>
      </div>
      <div className="user-profile-field">
        <label>Birthday</label>
        {localStorage.getItem("profileId") === localStorage.getItem("userId")? (
            <>
             <div>{user.birthDay? new Date(user.birthDay).toISOString().slice(0, 10) : "N/A"}</div>
             <input type="date" value={birthDay} onChange={e => setBirthDay(e.target.value)} />
            </>
        ) : (
            <div>{user.birthDay? new Date(user.birthDay).toISOString().slice(0, 10) : "N/A"}</div>
        )}
      </div>
      {localStorage.getItem("profileId") === localStorage.getItem("userId") ? (
        <>
            <div className="user-profile-field">
              <label>Enter Old Password</label>
              <input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} />
            </div>
            <div className="user-profile-field">
              <label>Set New Password</label>
              <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} />
            </div>
        </>
      ) : (
        null
      )}
    </div>
  );

  Profile.propTypes = {
    user: PropTypes.object,
  };

  let content = <Spinner />;

  if (userProfile) {
    content = (
        <div className="profile">
            <Profile user={userProfile} />
            <div className="profile button-container">
              {localStorage.getItem("profileId") === localStorage.getItem("userId") ?
                <Button
                  width="70%"
                  onClick={() => changeProfile()}
                  disabled={!username && !birthDay && !newPwd}
                >
                  Save Change
                </Button> :
                null
              }
            </div>
        </div>
    );
  }


  return (
    <BaseContainer className="profile container">
      <div className="headerrow" >
          <div><h2>User Profile</h2></div>
      </div>
      {content}
      <div className="profile button-container">
        <Button width="100%"
          onClick={() => {
            localStorage.removeItem("profileId");
            history.push("/home");
          }}
        >
          Return to Home
        </Button>
      </div>
    </BaseContainer>
  );
};

export default Profile;
