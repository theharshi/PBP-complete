import React, { Component } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { PredictorForm } from "../components/predictor/PredictorForm";

export const Predictor = () => {
    const { isAuthenticated } = useAuth0();
    return isAuthenticated ? (
        <PredictorForm></PredictorForm>
    ) : (
        <div className="alert alert-danger" role="alert">
            Please Login to continue
        </div>
    );
};
