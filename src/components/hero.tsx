import { useAuth0 } from "@auth0/auth0-react";

// const logo = "https://1000logos.net/wp-content/uploads/2017/09/Deutsche-Bank-Logo.png";

export const Hero = () => {
    // const { isAuthenticated } = useAuth0();
    return (
        <div className="text-center hero">
            <img className="mb-3 app-logo" src={"logo.png"} alt="React logo" height="140" width="140" />
            <h1 className="mb-4">The best way to predict the future is to study the past, or prognosticate.</h1>
        </div>
    );
};
