/* eslint-disable react/prop-types */

import React, { useContext } from "react";
import { UserContext } from "../index";
import { useHistory } from "react-router-dom";
import "../assets/css/login.scss";
import "../assets/login";

const Login = () => {
    const { auth, setAuth } = useContext(UserContext);
    let history = useHistory();

    const loginHandler = () => {
        localStorage.setItem("userToken", "super-secret-token");
        history.push("/admin");
    };
    return (
        <form id="app" className="ui-modal" data-state="idle" autoComplete="off" onSubmit={event => event.preventDefault()}>
            {/*Single page app olduğu için f5 atıyor. formu göndermesini engellemek için preventDefault*/}
            {/* axios ile gönderim yapılacak. Formun içindeki bilgiyi engelliyor.*/}
            <div className="ui-icon">
                <div className="ui-lock"></div>
            </div>
            {
                auth ? <p> Doğru</p>: <p>False</p>
            }
            <div className="ui-title">This link is password-protected</div>
            <div className="ui-subtitle">
                <span data-show="idle">
                  Please enter the password to view this link.
                </span>
                <span data-show="validating">
                  Validating...
                </span>
                <span data-show="error" className="ui-error">
                    Invalid password
                </span>
                <span data-show="success">
                    <a className="ui-link" href="https://xstate.js.org" target="_blank">xstate.js.org</a>
                </span>
            </div>
            <div className="ui-password">
                <input type="password" name="" id="" className="ui-password-input"
                       placeholder="the password is password"/>
                </div>
            <button className="ui-submit">Submit</button>
            <button className="ui-reset" type="button" title="Reset"></button>
        </form>
    );
};

export default Login;
