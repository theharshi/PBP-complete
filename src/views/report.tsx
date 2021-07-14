import { useAuth0 } from "@auth0/auth0-react";
import { Report } from "../components/Reports/Report";

export const Reports = () => {
    const { isAuthenticated } = useAuth0();
    return isAuthenticated ? (
        <Report></Report>
    ) : (
        <div className="alert alert-danger" role="alert">
            Please Login to continue
        </div>
    );
};
