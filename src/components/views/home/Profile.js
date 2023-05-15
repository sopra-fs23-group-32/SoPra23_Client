import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import { Spinner } from "components/ui/Spinner";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";

import { TextField } from "@material-ui/core";

import "styles/views/home/Profile.scss";

const ProfileInfo = ({ user }) => (
    <div className="user-profile">
        <div className="user-profile-field">
            <label>Username</label>
            <div className="profile field">{user.username}</div>
        </div>
        <div className="user-profile-field">
            <label>Status</label>
            <div className="profile field">{user.status}</div>
        </div>
        <div className="user-profile-field">
            <label>Created on</label>
            <div className="profile field">
                {new Date(user.createDay).toISOString().slice(0, 10)}
            </div>
        </div>
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
    const [password, setPassword] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const changeProfile = async () => {
        try {
            let requestBody;
            if (username === null) {
                let username = localStorage.getItem("username");
                requestBody = JSON.stringify({ username, password });
            } else {
                requestBody = JSON.stringify({ username, password });
            }
            const userURL = "/users/" + localStorage.getItem("userId");
            await api.put(userURL, requestBody);
			window.location.reload();
        } catch (error) {
            alert(
                `Something went wrong while updating your profile.\n${handleError(
                    error
                )}`
            );
        }
    };

    const handleEdit = () => {
        setIsEdit(!isEdit);
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
                    `An error occurs while fetching the user: \n${handleError(
                        error
                    )}`
                );
                alert(
                    `Something went wrong while fetching the user: \n${handleError(
                        error
                    )}`
                );
            }
        }
        fetchData();
    }, []);

    let content = <Spinner />;

    if (userProfile) {
        content = (
            <div className="profile">
                {isEdit ? (
                    <div className="user-profile-edit">
                        <div className="user-profile-field">
                            <label>UserName</label>
							<TextField className="input" size="small" value={localStorage.getItem("username")} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="user-profile-field">
                            <label>Passsword</label>
							<TextField className="input" type="password" size="small" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="profile button-container">
                            <Button
                                width="100%"
                                onClick={() => changeProfile()}
                                disabled={!password}
                            >
                                Save Change
                            </Button>
                        </div>
                    </div>
                ) : (
                    <ProfileInfo user={userProfile} />
                )}
            </div>
        );
    }

    return (
        <div className="profile container">
            <div className="headerrow">
                <div>
                    <h2>{isEdit?("Edit"):("User Profile")}</h2>
                </div>
            </div>
            <br></br>
            {content}
            <div className="profile button-container">
                <Button
                    width="30%"
                    onClick={() => {
                        localStorage.removeItem("profileId");
                        history.push("/home");
                    }}
                >
                    Return to Home
                </Button>
                {localStorage.getItem("profileId") ===
                localStorage.getItem("userId") ? (
                    <Button width="30%" onClick={() => handleEdit()}>
						{isEdit?"Profile":"Edit"}
                    </Button>
                ) : (
                    <></>
                )}

                <Button
                    width="30%"
                    onClick={() => history.push("/home/history")}
                >
                    History
                </Button>
            </div>
        </div>
    );
};

export default Profile;
