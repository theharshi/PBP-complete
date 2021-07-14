import React, { useRef } from "react";
import { useState } from "react";
import { ReportData } from "../../interfaces/interface";
import { useAuth0, User } from "@auth0/auth0-react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Modal } from "react-bootstrap";

export const SaveToReportBtn: React.FunctionComponent<any> = (props) => {
    let defaultUrl = "https://dp-reports-api.herokuapp.com";
    // let defaultUrl = "http://localhost:8080";
    const [show, setShow] = useState(false);
    const reportNameRef = useRef("");
    const favourite = useRef(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const { user } = useAuth0();
    const email = (user as User).email as string;
    const isReport = !!(props.chartData as ReportData).id;
    const renderSaveReportToolTip = (props: any) => <Tooltip {...props}>Save as Reports </Tooltip>;

    function handleSaveToReport(e: React.MouseEvent<HTMLElement, MouseEvent>) {
        let chartData = props.chartData;
        let reportDataRequest: ReportData = {
            emailId: email,
            reportName: reportNameRef.current,
            favourite: favourite.current,
            // createdAt: "2021-07-09T08:26:40.073Z",
            // updatedAt: "2021-07-09T08:26:40.073Z",
            // id: "60e808401463104fd03ec2b6",
            ...chartData,
        };
        console.log("reportDataRequest", reportDataRequest);
        const requestOptions: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reportDataRequest),
        };
        let url = defaultUrl + "/api/reports";
        fetch(url, requestOptions)
            // fetch("http://localhost:8080/api/reports/?emailId=" + email)
            .then((response) => {
                console.log("response", response);
                if (response.ok) {
                    // response.json().then((data) => {
                    console.log("response OK");
                    handleClose();
                    // });
                } else {
                    //NOTE:handle error
                    // chartMessage.current = response.statusText;
                    console.log("response ERROR", response);
                }
            })
            .catch((e) => {
                console.error(e);
            });
    }

    return (
        <div>
            {!isReport ? (
                <OverlayTrigger placement="top" overlay={renderSaveReportToolTip}>
                    <button
                        id="save-btn"
                        type="button"
                        className="btn btn-info ml-3 text-white"
                        onClick={(e) => {
                            // console.log("clicked");
                            handleShow();
                            // handleSaveToReport(e);
                        }}
                    >
                        <i className="fas fa-cloud-upload-alt"></i>
                    </button>
                </OverlayTrigger>
            ) : null}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Save to Reports</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <label htmlFor="reportName" className="form-label">
                        Enter Report name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="reportName"
                        placeholder="Untitled"
                        onChange={(e) => {
                            reportNameRef.current = e.currentTarget.value;
                        }}
                    />
                    <div className="form-check">
                        <input
                            className="form-check-input "
                            type="checkbox"
                            value=""
                            id="favourite"
                            onChange={(e) => {
                                let isChecked = e.target.checked;
                                favourite.current = isChecked;
                                // ((ref as any).current as Chart).hide(0);
                            }}
                        />
                        <label className="form-check-label" htmlFor="favourite">
                            Favourite
                        </label>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-primary mb-2"
                        onClick={(e) => {
                            // console.log("clicked");
                            handleSaveToReport(e);
                        }}
                    >
                        Save
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
