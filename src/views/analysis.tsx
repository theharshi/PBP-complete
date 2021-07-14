import React, { Component } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { AnalysisForm } from "../components/analysis/AnalysisForm";

export const Analysis = () => {
    const { isAuthenticated } = useAuth0();
    return isAuthenticated ? (
        <AnalysisForm></AnalysisForm>
    ) : (
        <div className="alert alert-danger" role="alert">
            Please Login to continue
        </div>
    );
};
