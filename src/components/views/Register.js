import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import User from "models/User";

import "styles/views/Register.scss";

const FormField = props => {
    return (
      <div className="register field">
        <label className="register label">{props.label}</label>
        <input
          className="register input"
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

const Register = props => {
    const history = useHistory();
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const doRegister = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            await api.post('/users', requestBody);
        } catch (error) {
            alert(`Your username has used, please use another one: \n${handleError(error)}`);
        }
        try {
          const requestBody = JSON.stringify({ username, password });
          const response = await api.put("/login", requestBody);
          // Get the returned user and update a new object.
          const user = new User(response.data);
          // Store the token into the local storage.
          localStorage.setItem("userId", user.userId);
          localStorage.setItem("username", user.username);
          history.push("/home");
        } catch (error) { }
    };

    return (
      <BaseContainer>
        <div className="register container">
          <div className="register form">
            <FormField
              label="Username"
              value={username}
              onChange={(name) => setUsername(name)}
            />
            <FormField
              label="Password"
              value={password}
              onChange={(pwd) => setPassword(pwd)}
            />
            <div className="register button-container">
              <Button
                disabled={!username || !password}
                width="80%"
                onClick={() => doRegister()}>
                Register
              </Button>
              <Button
                width="80%"
                onClick={() => history.push(`/login`)}>
                Back
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
export default Register;
