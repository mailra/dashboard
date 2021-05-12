import React, { createContext, useContext, useState } from "react";
import ReactDOM from "react-dom";
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
    Link,
    useHistory,
} from "react-router-dom";

// core components

import "assets/css/material-dashboard-react.css?v=1.10.0";
import Admin from "./layouts/Admin";
import Login from "./components/Login";

export const UserContext = createContext(false);

export const SecretRoute = () => {
    const { auth, setAuth } = useContext(UserContext);
    let history = useHistory();

    const logoutHandler = () => {
        setAuth(false);
        history.push("/login");
    };

    return (
        <Admin></Admin>
    );
};

export const page404 = () => {
    return <div>404</div>;
};

const PrivateRoute = ({ children, ...rest }) => {
    const { auth, setAuth } = useContext(UserContext);

    const isAuth = () => {
        const token = localStorage.getItem("userToken");
        if (token === "super-secret-token") {
            setAuth(true);
        }
    };

    isAuth();

    return (
        <Route
            {...rest} //ayıklamak için
            render={({ location }) =>
                auth ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export const App = () => {
    const [auth, setAuth] = useState(false);

    return (
        <UserContext.Provider value={{ auth, setAuth }}>
            <Router>
                <Switch>
                    <PrivateRoute path="/admin">
                        <SecretRoute />
                    </PrivateRoute>
                    <Route path="/login" exact component={Login} />
                    <Route path="/" component={Login} />

                    <Redirect from="/" to="/login" />
                </Switch>
            </Router>
        </UserContext.Provider>
    );
};

ReactDOM.render(<App />, document.getElementById("root"));
