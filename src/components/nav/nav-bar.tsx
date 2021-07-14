import React from "react";

import { MainNav } from "./main-nav";
import { AuthNav } from "../auth/auth-nav";
// var style = {
//   background-image : url(https://brandslogos.com/wp-content/uploads/images/large/deutsche-bank-logo.png);,
//   width: 2 rem;
//   height: 2.25rem;
//   background-repeat: no-repeat;
//   background-size: cover;
// };
// import "./app.css";

export const NavBar = () => {
    return (
        <div className="nav-container mb-3">
            <nav className="navbar navbar-expand-md navbar-light bg-light">
                <div className="container">
                    {/* <div className="navbar-brand" /> */}
                    <MainNav />
                    <AuthNav />
                </div>
            </nav>
        </div>
    );
};
