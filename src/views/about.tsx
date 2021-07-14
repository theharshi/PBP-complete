import React from "react";

export const about = () => {
    return (
        <div className="text-center hero">
            <h1 className="mb-8">Welcome to Position Balance Predictor</h1>
            <p className="lead">
                Once logged in, this app helps the user to predict the total deposits and withdrawl of all banks of the
                united states from the the time frame that user has entered. we have used different parameters like
                inflation rate, interest rate, employment rate and average hourly pay during the given time frame to
                predict the asked output out of deposits,withdrawal and balance
                <br></br>
                Head on to <a href="/predictor">Predictor</a> ( make sure you are logged in ) tab to predict
                deposits/withdral/balance
            </p>
        </div>
    );
};
