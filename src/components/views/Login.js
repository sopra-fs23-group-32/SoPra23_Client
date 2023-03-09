import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import {api, handleError} from 'helpers/api';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import User from 'models/User';

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
      <div className="login field">
        <label className="login label">
          {props.label}</label>
        <input
          className="login input"
          placeholder="enter here.."
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
        />
      </div>
    );
};
FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Login = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({ username, password });
            const response = await api.put('/login', requestBody);
            // Get the returned user and update a new object.
            const user = new User(response.data);
            // Store the token into the local storage.
            localStorage.setItem('userId', user.userId);
            localStorage.setItem("username", user.username);

            // Login successfully worked --> navigate to the route /home in the HomeRouter
            history.push('/home');
        }
        catch (error) {
            alert(`An error occurs during the login: \n${handleError(error)}`);
        }
    };

    return (
      <BaseContainer>
        <div className="login container">
          <div className="login form">
            <FormField
              label="Username" value={username}
              onChange={(name) => setUsername(name)}
            />
            <FormField
              label="Password" value={password}
              onChange={(pwd) => setPassword(pwd)}
            />
            <div className="login button-container">
              <Button
                disabled={!username || !password}
                width="80%"
                onClick={() => doLogin()}
              >
                Log in
              </Button>{" "}
              <Button 
                width="80%" 
                onClick={() => history.push("/register")}
              >
                Register
              </Button>
            </div>
          </div>
        </div>
      </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
