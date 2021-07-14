import React, { useRef } from "react";
import { useState } from "react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Button, Modal } from "react-bootstrap";
import { ReportData } from "../../interfaces/interface";

export const DeleteReportBtn: React.FunctionComponent<any> = (props) => {
    let defaultUrl = "https://dp-reports-api.herokuapp.com";
    // let defaultUrl = "http://localhost:8080";

    let reportData: ReportData = props.reportData;
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const renderDeleteReportToolTip = (props: any) => <Tooltip {...props}>Delete this Reports </Tooltip>;

    const handleDeleteReport = () => {
        const requestOptions = {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        };
        let url = defaultUrl + "/api/reports/" + reportData.id;
        fetch(url, requestOptions).then((response) => {
            console.log("response", response);
            if (response.ok) {
                handleClose();
                props.setDelete((cnt: number) => cnt + 1);
                console.log("This report with id " + reportData.id + " was deleted!");
            } else {
                //NOTE:handle error
                // chartMessage.current = response.statusText;
                console.log("response ERROR", response);
            }
        });
    };

    return (
        <>
            <OverlayTrigger placement="top" overlay={renderDeleteReportToolTip}>
                <button
                    id="save-btn"
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                        // console.log("clicked");
                        handleShow();
                    }}
                >
                    <i className="far fa-trash-alt"></i>
                </button>
            </OverlayTrigger>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <p className="card-text">
                            Report Id: <i>{reportData.id}</i>
                        </p>
                        <p className="card-text">
                            Report Name: <i>{reportData.reportName === "" ? "Untitled" : reportData.reportName}</i>
                        </p>
                    </div>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Button
                        variant="danger mb-2"
                        onClick={(e) => {
                            // console.log("clicked");
                            handleDeleteReport();
                        }}
                    >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
