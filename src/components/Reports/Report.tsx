import { useState, useEffect } from "react";
import { Card } from "./Card";
import { useAuth0, User } from "@auth0/auth0-react";
import { NavLink } from "react-router-dom";
import { report } from "process";
import { ReportType } from "../../interfaces/enums";
import { ReportData } from "../../interfaces/interface";

export const Report = () => {
    let defaultUrl = "https://dp-reports-api.herokuapp.com";
    // let defaultUrl = "http://localhost:8080";

    //useEffect API call against email ID
    const [reportDataArr, setReportData] = useState<ReportData[]>([]);
    const [reportType, setReportType] = useState(ReportType.All);

    const [del, setDelete] = useState(0);
    const [load, setLoad] = useState(true);
    const { user } = useAuth0();
    const email = (user as User).email;
    // console.log("rendered reprts", reportType);

    useEffect(() => {
        let unmounted = false;
        let url = defaultUrl + "/api/reports/?emailId=" + email;
        fetch(url)
            .then((response) => {
                if (!unmounted) {
                    if (response.ok) {
                        response.json().then((data) => {
                            console.log("Reports response", data);
                            setLoad(false);
                            setReportData(data.reverse());
                        });
                    } else {
                        //NOTE:handle error
                        // chartMessage.current = response.statusText;
                        alert("response ERROR" + response.statusText);
                        setLoad(false);
                    }
                }
            })
            .catch((e) => {
                if (!unmounted) {
                    alert("response ERROR" + e);
                    setLoad(false);
                }
            });
        //if components unmounts and the fetch finishes
        return function cleanup() {
            unmounted = true;
        };
    }, [del]);

    return (
        <div>
            <div className="container-fluid d-flex justify-content-center">
                <table className="table">
                    <thead>
                        <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{ marginLeft: "10.5px" }}>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-toggle="collapse"
                                data-target="#navbarSupportedContent"
                                aria-controls="navbarSupportedContent"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav mr-auto">
                                    <li className="nav-item active">
                                        <NavLink
                                            to="/report"
                                            exact
                                            className="nav-link"
                                            activeClassName={
                                                reportType === ReportType.All ? "router-link-exact-active" : ""
                                            }
                                            id="navreport"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setReportType(ReportType.All);
                                            }}
                                            style={{ marginLeft: "200px" }}
                                        >
                                            All
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/report"
                                            exact
                                            className="nav-link"
                                            activeClassName={
                                                reportType === ReportType.Favourites ? "router-link-exact-active" : ""
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setReportType(ReportType.Favourites);
                                            }}
                                            style={{ marginLeft: "100px" }}
                                        >
                                            Favourites
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/report"
                                            exact
                                            className="nav-link"
                                            activeClassName={
                                                reportType === ReportType.Predicted ? "router-link-exact-active" : ""
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setReportType(ReportType.Predicted);
                                            }}
                                            style={{ marginLeft: "100px" }}
                                        >
                                            Predicted
                                        </NavLink>
                                    </li>
                                    <li className="nav-item">
                                        <NavLink
                                            to="/report"
                                            exact
                                            className="nav-link"
                                            activeClassName={
                                                reportType === ReportType.Historical ? "router-link-exact-active" : ""
                                            }
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setReportType(ReportType.Historical);
                                            }}
                                            style={{ marginLeft: "100px" }}
                                        >
                                            Historical
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </thead>

                    <br></br>
                    <tbody>
                        {reportDataArr.length !== 0 ? (
                            reportDataArr.map((reportData, index) => {
                                return (
                                    <div key={reportData.id}>
                                        <Card reportData={reportData} setDelete={setDelete} reportType={reportType} />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center">
                                {!load ? (
                                    <>
                                        <h1 className="mb-8">No reports to display!</h1>
                                        <p className="lead">
                                            Head on to <NavLink to="/predictor">Predictor</NavLink> to make some
                                            predictions.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="lead">...Loading data</p>
                                    </>
                                )}
                            </div>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
