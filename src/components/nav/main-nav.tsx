import { NavLink } from "react-router-dom";
import React from "react";
import "../../css/home.css";
import { useAuth0 } from "@auth0/auth0-react";

export const MainNav = () => {
    const { isAuthenticated } = useAuth0();

    return (
        <div className="navbar-nav mr-auto">
            {/* <div></div.>> */}
            <NavLink to="/" exact className="nav-link" activeClassName="router-link-exact-active">
                Home
            </NavLink>
            {isAuthenticated ? (
                <NavLink to="/analysis" exact className="nav-link" activeClassName="router-link-exact-active">
                    Analyze
                </NavLink>
            ) : null}
            {isAuthenticated ? (
                <NavLink to="/predictor" exact className="nav-link" activeClassName="router-link-exact-active">
                    Predictor
                </NavLink>
            ) : null}
            {isAuthenticated ? (
                <NavLink to="/report" exact className="nav-link" activeClassName="router-link-exact-active">
                    Reports
                </NavLink>
            ) : null}

            {/* {isAuthenticated ? (
                <NavLink to="/profile" exact className="nav-link" activeClassName="router-link-exact-active">
                    Profile
                </NavLink>
            ) : null} */}
            <NavLink to="/about" exact className="nav-link" activeClassName="router-link-exact-active">
                About
            </NavLink>
        </div>
    );
};
