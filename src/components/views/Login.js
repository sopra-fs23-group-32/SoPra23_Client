import React, {useState} from 'react';
import { useHistory } from "react-router-dom";
import {api, handleError} from 'helpers/api';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";
import { TextField } from "@mui/material";

import PropTypes from "prop-types";
import User from 'models/User';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FormField = (props) => {
    return (
      <div className="login field">
      <TextField
          label={props.label}
          className="login input"
          placeholder="Enter Username here..."
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          onKeyDown={(e) => props.onKeyDown(e)}        
          />
      </div>
    );
};

const FormField2 = (props) => {
  return (
    <div className="login field">
      <TextField
        label={props.label}
        type="password"
        className="login input"
        placeholder="Enter Password here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={(e) => props.onKeyDown(e)}
        id="fullWidth"
        
        />
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



const Login = props => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({ username, password });
            const response = await api.put("/login", requestBody);
            // Get the returned user and update a new object.
            const user = new User(response.data);
            // Store the token into the local storage.
            localStorage.setItem("userId", user.userId);
            localStorage.setItem("username", user.username);

            // Login successfully worked --> navigate to the route /home in the HomeRouter
            history.push("/home");
        }
        catch (error) {
//          alert(`An error occurs during the login: \n${handleError(error)}`);
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
      <BaseContainer>
<div id= "container">
    <section className="container">
  <div className="bg-image"></div>
  <div className="content" >
    
  <div></div>
  <div className="Logo"></div>
  <div className="headerrow" >
      <div className="headerp1" ><h1>User Login</h1></div>
  </div>


      <div className="login container">
        <div className="login form">
          <FormField
            value={username}
            onChange={un => setUsername(un)}
            onKeyDown = {handleKeyDown}
          />
         
          <FormField2
            placeholder="mas"
            value={password}
            onChange={n => setPassword(n)}
            onKeyDown = {handleKeyDown}
          />

      

          <div className="register-button-container" >
          <Button disabled={!username || !password}  width="40%" onClick={() => doLogin()}>Login</Button>

          <td>&nbsp;&nbsp;&nbsp;</td>
          <div className="login-button-container">

          <Button   width="40%" onClick={() => history.push('/register')}>Register here</Button>

          </div>
          </div>
        </div>
      </div>
      </div>
      </section>
</div>
<ToastContainer />
    </BaseContainer>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
