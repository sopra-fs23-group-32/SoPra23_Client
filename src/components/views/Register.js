import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import { TextField } from "@mui/material";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";




const FormField = (props) => {
  return (
    <div className="register field">
      <TextField
                label={props.label}

        className="register input"
        placeholder="Enter Username here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={(event) => props.onKeyDown(event)}
      />
    </div>
  );
};

const FormField2 = (props) => {
  return (
    <div className="register field">
       <TextField
                label={props.label}
        type="password"
        className="register input"
        placeholder="Enter Password here..."
        value={props.value}
        onChange={e => props.onChange(e.target.value)}
        onKeyDown={(e) => {
          props.onKeyDown(e);
        }}
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

const Register = () => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  
  const doRegister = async () => {
    try {
      const requestBody = JSON.stringify({username, password});
      const response = await api.post("/users", requestBody);
      // Get the returned user and update a new object.
      const user = new User(response.data);
      // Store the token into the local storage.
      localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("username", user.username);

      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/home`);
    } catch (error) {
      alert(`Something went wrong during the login: \n${handleError(error)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      doRegister();
    }
  };


  return (
    <BaseContainer>

    <section className="container">
  <div className="bg-image"></div>
  <div className="content" >
    
  <div></div>
  <div className="Logo"></div>
  <div className="headerrow">
      <div className="headerp1" ><h1>User Registration</h1></div>
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
          <Button disabled={!username || !password}  width="40%" onClick={() => doRegister()}>Registration</Button>

          <td>&nbsp;&nbsp;&nbsp;</td>
          <div className="login-button-container">

          <Button   width="40%" onClick={() => history.push('/login')}>Login here</Button>

          </div>
          </div>
        </div>
      </div>
      </div>
      </section>

    </BaseContainer>
  );
};


export default Register;
