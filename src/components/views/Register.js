import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Register.scss';
import { TextField } from "@mui/material";
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InformationContainer from "components/ui/BaseContainer";


const FormField = (props) => {
  return (
    <div className="login field">
    <input className="login input"
        label={props.label}
        placeholder="Enter Username here..."
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        onKeyDown={(e) => props.onKeyDown(e)}        
        >
    </input>
    </div>
  );
};

const FormField2 = (props) => {
return (
  <div className="login field" style={{marginBottom:"0px"}}>
    <input 
      label={props.label}
      type="password"
      className="login input"
      placeholder="Enter Password here..."
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      onKeyDown={(e) => props.onKeyDown(e)}
      id="fullWidth">
    </input>
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
      // localStorage.setItem("token", user.token);
      localStorage.setItem("userId", user.userId);
      localStorage.setItem("username", user.username);
      // Login successfully worked --> navigate to the route /game in the GameRouter
      history.push(`/home`);
    }
    catch (error) {
        toast.error(`${error.response.data.message}`);
        console.log(handleError(error));
    }
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      doRegister();
    }
  };


  return (
    <div className="Registration container" style={{flexDirection: "column"}}>
      <InformationContainer className="registration container" style={{fontSize: '48px', width: "fit-content"}}>
        Registration
      </InformationContainer>
    <InformationContainer className="registration container" style={{flexDirection: "column"}}>
      <div className="registration form">
        <FormField
          value={username}
          onChange={un => setUsername(un)}
          onKeyDown = {handleKeyDown}
        />
       
        <FormField2 
          value={password}
          onChange={n => setPassword(n)}
          onKeyDown = {handleKeyDown}
        />
        <div style={{fontSize:"16px", marginBottom:"20px"}}>
          <div>The password has to contain one of the following:</div>
          <div>An uppercase letter, a lowercase letter and a number</div>
        </div>

        <div className="registration-button-container" style={{display: "flex",justifyContent: 'space-between'}} >
        <Button style={{flex:1, marginRight:"40px"}} disabled={!username || !password} onClick={() => doRegister()}>
          Register
        </Button>
        <Button style={{flex:1}} onClick={() => history.push('/login')}>
          Login here
        </Button>
        </div>
      </div>
    </InformationContainer>
    <ToastContainer />
  </div>

);
};


export default Register;
