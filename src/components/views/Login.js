import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { api, handleError } from "helpers/api";
import "styles/views/Login.scss";
import BaseContainer from "components/ui/BaseContainer";
import { Button } from "components/ui/Button";

import { TextField } from "@mui/material";

import PropTypes from "prop-types";
import User from "models/User";

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

const Login = (props) => {
    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({ username, password });
            const response = await api.put("/login", requestBody);

            const user = new User(response.data);

            localStorage.setItem("userId", user.userId);
            localStorage.setItem("username", user.username);
            history.push("/home");
        } catch (error) {
            alert(`An error occurs during the login: \n${handleError(error)}`);
        }
    };

    const handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            doLogin();
        }
    };

    return (
        <BaseContainer>
            <div id="container">
                <section className="container">
                    <div className="bg-image"></div>
                    <div className="content">
                        <div></div>
                        <div className="Logo"></div>
                        <div className="headerrow">
                            <div className="headerp1">
                                <h1>User Login</h1>
                            </div>
                        </div>

                        <div className="login container">
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

                                <div className="register-button-container">
                                    <Button
                                        disabled={!username || !password}
                                        width="40%"
                                        onClick={() => doLogin()}
                                    >
                                        Login
                                    </Button>

                                    <Button
                                        width="40%"
                                        onClick={() =>
                                            history.push("/register")
                                        }
                                    >
                                        Register here
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </BaseContainer>
    );
};

export default Login;
