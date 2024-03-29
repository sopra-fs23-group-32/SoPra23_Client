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
        <label style={{flexBasis:"33%"}}>Username</label>
        {localStorage.getItem("profileId") === localStorage.getItem("userId") ? (
          <>
             <input type="text"style={{color:"white"}} defaultValue={user.username} onChange={e => setUsername(e.target.value)} />
          </>
        ) : (
            <div>{user.username}</div>
        )}
      </div>
      <div className="user-profile-field">
        <label>Status</label>
        <div>{user.status === 'ONLINE' ? 'Online' : 'Offline'}</div>
      </div>
      <div className="user-profile-field">
        <label>Created on</label>
        <div>{new Date(user.createDay).toISOString().slice(0, 10)}</div>
      </div>
      <div className="user-profile-field">
      <label>Birthday</label>
      {localStorage.getItem("profileId") === localStorage.getItem("userId") ? (
        <>
          <div>
            {user.birthDay ? new Date(user.birthDay).toISOString().slice(0, 10) : "Not Set"}
          </div>
          <input 
            type="date" 
            style={{color:"white"}}
            defaultValue={user.birthDay} 
            max={new Date().toISOString().slice(0,10)}
            onChange={e => setBirthDay(e.target.value)} 
          />
        </>
      ) : (
        <div>
          {user.birthDay ? new Date(user.birthDay).toISOString().slice(0, 10) : "No Birthday set yet"}
        </div>
      )}
    </div>

      {localStorage.getItem("profileId") === localStorage.getItem("userId") ? (
        <>
          <div className="user-profile-field">
            <label style={{flexBasis:"33%"}}>Enter Old Password</label>
            <input type="password" style={{color:"white"}} onChange={e => setOldPwd(e.target.value)} />
          </div>
          <div className="user-profile-field">
            <label style={{flexBasis:"33%"}}>Set New Password</label>
            <input type="password" style={{color:"white"}}  onChange={e => setPassword(e.target.value)} />
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
              localStorage.setItem("username", username);
              requestBody = JSON.stringify({ username, password, birthDay });
            }
            else{
              requestBody = JSON.stringify({ username, password, birthDay });
              localStorage.setItem("username", username);
            }
            const userURL = "/users/" + localStorage.getItem("userId");
            await api.put(userURL, requestBody);
            
            window.location.reload();
        } catch (error) {
            toast.warning(`Something went wrong while updating your profile.`);
            console.log(handleError(error));
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
    <div className="page-container">
    <div className="Profile container" style={{flexDirection: "column"}}>
      
    <InformationContainer className="profile container" style={{width: "fit-content"}}>
      <h2>Profile</h2>
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
    </div>
  );
};

export default Profile;
