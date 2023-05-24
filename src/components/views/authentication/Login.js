import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import InformationContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import PropTypes from "prop-types";
import User from "models/User";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "styles/views/authentication/Login.scss";

const FormField = (props) => {
  return (
    <div className="login field">
      <input
        className="login input"
        label={props.label}
        placeholder="Enter Username here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={(e) => props.onKeyDown(e)}
      ></input>
    </div>
  );
};

const FormField2 = (props) => {
  return (
    <div className="login field">
      <input
        label={props.label}
        type="password"
        className="login input"
        placeholder="Enter Password here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={(e) => props.onKeyDown(e)}
        id="fullWidth"
      ></input>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};
FormField2.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

const Login = (props) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const doLogin = async () => {
    try {
      const requestBody = JSON.stringify({ username, password });
      const response = await api.put("/login", requestBody);
      await new Promise((resolve) => setTimeout(resolve, 500));
      // Get the returned user and update a new object.
      const user = new User(response.data);
      // Store the token into the local storage.
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("username", user.username);
      console.log("User Login: ", response.data)
      // Login successfully worked --> navigate to the route /home in the HomeRouter
      history.push("/home");
    } catch (error) {
      toast.error(`${error.response.data.message}`);
      console.log(handleError(error));
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      doLogin();
    }
  };

  return (
    <div className="Login container" style={{ flexDirection: "column" }}>
      <InformationContainer
        className="login container"
        style={{ fontSize: "48px", width: "fit-content" }}
      >
        Login
      </InformationContainer>
      <InformationContainer
        className="login container"
        style={{ flexDirection: "column" }}
      >
        <div className="login form">
          <FormField
            value={username}
            onChange={(un) => setUsername(un)}
            onKeyDown={handleKeyDown}
          />

          <FormField2
            placeholder="mas"
            value={password}
            onChange={(n) => setPassword(n)}
            onKeyDown={handleKeyDown}
          />

          <div
            className="login-button-container"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              style={{ flex: 1, marginRight: "40px" }}
              disabled={!username || !password}
              onClick={() => doLogin()}
            >
              Login
            </Button>
            <Button
              style={{ flex: 1 }}
              onClick={() => history.push("/register")}
            >
              Register here
            </Button>
          </div>
        </div>
      </InformationContainer>
      <ToastContainer />
    </div>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
