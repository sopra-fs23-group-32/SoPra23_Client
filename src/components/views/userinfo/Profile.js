import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import InformationContainer from "components/ui/BaseContainer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "styles/views/userinfo/Profile.scss";

const ProfileInfo = ({ user, setUsername, setBirthDay, setOldPwd, setPassword }) => (
    <div className="user-profile">
      <div className="user-profile-field">
        <label>Username</label>
        {localStorage.getItem("profileId") === localStorage.getItem("userId") ? (
          <>
             <input type="text" defaultValue={user.username} onChange={e => setUsername(e.target.value)} />
          </>
        ) : (
            <value>{user.username}</value>
        )}
      </div>
      <div className="user-profile-field">
        <label>Status</label>
        <value>{user.status}</value>
      </div>
      <div className="user-profile-field">
        <label>Created on</label>
        <value>{new Date(user.createDay).toISOString().slice(0, 10)}</value>
      </div>
      <div className="user-profile-field">
      <label>Birthday</label>
      {localStorage.getItem("profileId") === localStorage.getItem("userId") ? (
        <>
          <value>
            {user.birthDay ? new Date(user.birthDay).toISOString().slice(0, 10) : "No Birthday set yet"}
          </value>
          <input 
            type="date" 
            defaultValue={user.birthDay} 
            max={new Date().toISOString().slice(0,10)}
            onChange={e => setBirthDay(e.target.value)} 
          />
        </>
      ) : (
        <value>
          {user.birthDay ? new Date(user.birthDay).toISOString().slice(0, 10) : "No Birthday set yet"}
        </value>
      )}
    </div>

      {localStorage.getItem("profileId") === localStorage.getItem("userId") ? (
        <>
          <div className="user-profile-field">
            <label>Enter Old Password</label>
            <input type="password" onChange={e => setOldPwd(e.target.value)} />
          </div>
          <div className="user-profile-field">
            <label>Set New Password</label>
            <input type="password" onChange={e => setPassword(e.target.value)} />
          </div>
        </>
      ) : (
        null
      )}
    </div>
);

ProfileInfo.propTypes = {
user: PropTypes.object,

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
  const [oldPwd, setOldPwd] = useState(null);
  const [password, setPassword] = useState(null);

  const changeProfile = async () => {
      if(oldPwd !== null && oldPwd !== userProfile.password) {
        toast.error("Your old password is wrong, try again.")
      }
      else {
        try {
            let requestBody;
            if(username === null) {
              let username = localStorage.getItem("username");
              requestBody = JSON.stringify({ username, password, birthDay });
            }
            else{
              requestBody = JSON.stringify({ username, password, birthDay });
            }
            const userURL = "/users/" + localStorage.getItem("userId");
            await api.put(userURL, requestBody);
            window.location.reload();
        } catch (error) {
            toast.error(`${error.response.data.message}`);
            console.error(
              `Something went wrong while updating your profile.\n${handleError(error)}`
            );
        }
      }


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
        console.log("User Profile:", response.data);

      } catch (error) {
        console.error(
          `An error occurs while fetching the user: \n${handleError(error)}`
        );
      }
    }
    fetchData();
  }, []);


  let content = <Spinner />;

  if (userProfile) {
    content = (
      <div className="profile">
        <ProfileInfo user={userProfile} setUsername={setUsername} setBirthDay={setBirthDay} setOldPwd={setOldPwd} setPassword={setPassword} />
        <div className="profile button-container">
          {localStorage.getItem("profileId") === localStorage.getItem("userId") ?
            <Button width="50%"
              onClick={() => changeProfile()}
              disabled={!username && !birthDay && !password}
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
    <div className="Profile container" style={{flexDirection: "column"}}>
      <InformationContainer className="profile container" style={{fontSize: '48px', width: "fit-content"}}>
        Profile
      </InformationContainer>
    <InformationContainer className="profile container" style={{width: "fit-content"}}>
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
      </InformationContainer>
    <ToastContainer />
    </div>
  );
};

export default Profile;
