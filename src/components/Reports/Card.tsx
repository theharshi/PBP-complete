import { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { PredictionType, ReportType } from "../../interfaces/enums";
import { LineChart } from "../chart/LineChart";
import { DataHelper } from "../services/DataHelper";
import "./Card.css";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { DeleteReportBtn } from "./DeleteReportBtn";
import { ReportData } from "../../interfaces/interface";

export const Card = (props: any) => {
    let defaultUrl = "https://dp-reports-api.herokuapp.com";
    // let defaultUrl = "http://localhost:8080";

    const reportData = props.reportData as ReportData;
    const [valid, setValidity] = useState(checkValidity());

    const curReportName = useRef(props.reportData.reportName);
    const [edit, setEdit] = useState(false);
    const [fav, setFav] = useState(reportData.favourite);
    const freq = useRef("");

    const [show, setShow] = useState(false);

    const renderlinkToolTip = (props: any) => <Tooltip {...props}>Open this Report in Predictor </Tooltip>;
    const renderChartToolTip = (props: any) => <Tooltip {...props}>Click to toggle chart view </Tooltip>;
    const renderFavToolTip = (props: any) => <Tooltip {...props}>{fav ? "Delete from" : "Add to"} Favourites </Tooltip>;

    if (props.reportData.frequency === 0) {
        if (props.reportData.count == 1) freq.current = "week";
        else freq.current = "weeks";
    } else if (props.reportData.frequency === 1) {
        if (props.reportData.count == 1) freq.current = "month";
        else freq.current = "months";
    } else {
        if (props.reportData.count == 1) freq.current = "year";
        else freq.current = "years";
    }

    const handleUpdateName = () => {
        let newName = curReportName.current;
        let oldName = reportData.reportName;
        if (newName !== oldName) {
            let newReportData = DataHelper.cloneObject(reportData as Object) as ReportData;
            newReportData.reportName = newName;
            console.log("request", newReportData);
            const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReportData),
            };
            let url = defaultUrl + "/api/reports/" + reportData.id;
            fetch(url, requestOptions)
                .then((response) => {
                    console.log("response", response);
                    if (response.ok) {
                        reportData.reportName = newName;
                    } else {
                        curReportName.current = reportData.reportName;
                        alert("response ERROR while saving name = " + response.statusText);
                    }
                    setEdit(false);
                })
                .catch((e) => {
                    curReportName.current = reportData.reportName;
                    alert("response ERROR while saving name = " + e);
                    setEdit(false);
                });
        }
    };

    const handleToggleFav = () => {
        let newReportData = DataHelper.cloneObject(reportData as Object) as ReportData;
        newReportData.favourite = !newReportData.favourite;
        console.log("request", newReportData);
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newReportData),
        };
        let url = defaultUrl + "/api/reports/" + reportData.id;
        fetch(url, requestOptions)
            .then((response) => {
                console.log("response", response);
                if (response.ok) {
                    reportData.favourite = newReportData.favourite;
                } else {
                    alert("response ERROR while saving name = " + response.statusText);
                }
                setFav(reportData.favourite);
            })
            .catch((e) => {
                alert("response ERROR while saving name = " + e);
            });
    };

    function checkValidity() {
        let reportType = props.reportType as ReportType;
        let isValid = true;
        if (reportType == ReportType.Favourites) {
            isValid = reportData.favourite;
        } else if (reportType == ReportType.Historical) {
            isValid = reportData.count < 0;
        } else if (reportType == ReportType.Predicted) {
            isValid = reportData.count >= 0;
        }
        return isValid;
    }

    useEffect(() => {
        setValidity(checkValidity());
        // console.log(props.reportType, valid);
    });

    return (
        <div>
            {valid ? (
                <div className="container">
                    <div className="card" id="card">
                        <div className="card-header text-center font-weight-bold">
                            <form className="form-inline d-inline-flex ">
                                <div className=" form-group">
                                    {edit ? (
                                        <input
                                            type="text"
                                            // className="text-center"
                                            className="form-control"
                                            defaultValue={reportData.reportName}
                                            onChange={(e) => {
                                                curReportName.current = e.target.value;
                                            }}
                                        ></input>
                                    ) : (
                                        [reportData.reportName === "" ? "Untitled" : reportData.reportName]
                                    )}
                                </div>
                                <div className="">
                                    {!edit ? (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            style={{ marginLeft: "20px" }}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setEdit(true);
                                            }}
                                        >
                                            <i className="far fa-edit"></i>
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            style={{ marginLeft: "20px" }}
                                            onClick={(e) => {
                                                // props.onUpdate(name.current, reportData);
                                                handleUpdateName();
                                                e.preventDefault();
                                            }}
                                        >
                                            Save
                                        </button>
                                    )}
                                </div>
                            </form>
                            <div className="" style={{ float: "right" }}>
                                <OverlayTrigger placement="top" overlay={renderFavToolTip}>
                                    <button
                                        className={fav === true ? "btn btn-warning btn-sm" : "btn btn-light btn-sm"}
                                        style={{ marginRight: "8px" }}
                                        onClick={(e) => {
                                            handleToggleFav();
                                        }}
                                    >
                                        <i className="far fa-star"></i>
                                    </button>
                                </OverlayTrigger>
                                <DeleteReportBtn
                                    reportData={props.reportData}
                                    setDelete={props.setDelete}
                                ></DeleteReportBtn>
                                {/* <OverlayTrigger placement="top" overlay={renderlinkToolTip}>
                                    <button
                                        type="button"
                                        // style={{ float: "right" }}
                                        style={{ marginLeft: "8px" }}
                                        className="btn btn-info btn-sm"
                                        onClick={(e) => {}}
                                    >
                                        <i className="fas fa-external-link-alt"></i>
                                    </button>
                                </OverlayTrigger> */}
                            </div>
                        </div>
                        <div className="card-text  text-center">
                            <div className="overflow">
                                <NavLink
                                    to="/report"
                                    style={{ textDecoration: "none" }}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setShow(!show);
                                    }}
                                    className="card-body text-dark"
                                >
                                    {/* <OverlayTrigger placement="top" overlay={renderChartToolTip}>
                                    <h5 className="card-title">Report ID: {reportDataArr.id}</h5>
                                </OverlayTrigger> */}

                                    <div className="card-text">
                                        <OverlayTrigger placement="top" overlay={renderChartToolTip}>
                                            <b>Attribute: {DataHelper.getKey(PredictionType, reportData.type)}</b>
                                        </OverlayTrigger>
                                        <br />
                                        <b>
                                            {reportData.count >= 0 ? (
                                                <>
                                                    Frequency: {reportData.count} {freq.current} forward
                                                </>
                                            ) : (
                                                <>Historical Data</>
                                            )}
                                        </b>
                                        <br />
                                        Created on:{" "}
                                        {reportData.createdAt ? reportData.createdAt.split("T")[0] : "No Data"}
                                        <br />
                                        Updated on:{" "}
                                        {reportData.updatedAt ? reportData.updatedAt.split("T")[0] : "No Data"}
                                    </div>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <br />
                    {show ? <LineChart chartData={reportData}></LineChart> : null}
                </div>
            ) : null}
        </div>
    );
};
