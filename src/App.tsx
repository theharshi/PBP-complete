import React from "react";
import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { NavBar } from "./components/nav/nav-bar";
import { Loading } from "./components/auth/loading";
import { Footer } from "./components/Footer";
import { Home } from "./views/home";
import { Profile } from "./views/profile";
import { about } from "./views/about";
import { Predictor } from "./views/predictor";
import ProtectedRoute from "./auth/protected-route";
import { Analysis } from "./views/analysis";
import { Reports } from "./views/report";
import "./App.css";

const App = () => {
    const { isLoading } = useAuth0();

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div id="app" className="d-flex flex-column h-100">
            <NavBar />
            <div className="container flex-grow-1">
                <Switch>
                    <Route path="/" exact component={Home} />
                    <ProtectedRoute path="/analysis" component={Analysis} />
                    <ProtectedRoute path="/predictor" component={Predictor} />
                    <ProtectedRoute path="/report" component={Reports} />
                    {/* <ProtectedRoute path="/profile" component={Profile} /> */}
                    <Route path="/about" component={about} />
                </Switch>
            </div>
            <Footer />
        </div>
    );
};

export default App;
