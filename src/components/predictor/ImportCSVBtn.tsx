import React, { useRef } from "react";
import { useState } from "react";
import { ReportData } from "../../interfaces/interface";
import { useAuth0, User } from "@auth0/auth0-react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Modal } from "react-bootstrap";

export const ImportCSVBtn: React.FunctionComponent<any> = (props) => {
    const [show, setShow] = useState(false);
    let inputRef = useRef<any>();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const renderImportCSVToolTip = (props: any) => <Tooltip {...props}>Import a csv file </Tooltip>;

    function handleCSVImport() {
        if (!inputRef.current) return;
        let requiredColNames = ["Interest Inflation Gap", "Average Pay", "Employment Rate"];
        let fileUpload = inputRef.current as HTMLInputElement;
        // console.log(fileUpload.files);
        // let regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
        // if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof FileReader != "undefined") {
            let reader = new FileReader();
            reader.onload = function (e) {
                if (!(typeof e.target?.result === "string")) {
                    console.error(typeof e.target?.result);
                    return;
                }
                let string = e.target?.result as string;
                string = string.replaceAll("\r", "");
                let rows = string.split("\n");
                let fileColumnNames = rows[0].split(",");
                // console.log(rows);
                let columnNumberMap = new Map<number, number>();
                for (let i = 0; i < fileColumnNames.length; i++) {
                    const fileColumnName = fileColumnNames[i];
                    let index = requiredColNames.indexOf(fileColumnName);
                    // console.log(fileColumnName, requiredColNames, index);
                    if (index >= 0) {
                        columnNumberMap.set(index, i);
                    }
                }
                if (columnNumberMap.size == 0) {
                    alert("Column Header miss Match");
                    handleClose();
                    return;
                }
                let inputList: string[][] = [];
                for (let i = 1; i < rows.length; i++) {
                    let row = rows[i].split(",");
                    let inputListRow = ["", "", ""];
                    if (row.length > 0) {
                        for (let j = 0; j < inputListRow.length; j++) {
                            let index = columnNumberMap.get(j);
                            if (typeof index === "number") inputListRow[j] = row[index];
                        }
                        // console.log(inputListRow);
                        inputList.push(inputListRow);
                    }
                }

                let inputListToSet: { gap: string; avgPay: string; emprt: string }[] = [];
                for (let i = 0; i < inputList.length; i++) {
                    inputListToSet.push({
                        gap: inputList[i][0],
                        avgPay: inputList[i][1],
                        emprt: inputList[i][2],
                    });
                }
                // console.log("uploaded file", inputListToSet, props);
                props.setInputList(inputListToSet);
                handleClose();
            };
            if (fileUpload.files) reader.readAsText(fileUpload.files[0]);
        } else {
            alert("This browser does not support HTML5.");
        }
    }

    return (
        <div>
            <OverlayTrigger placement="top" overlay={renderImportCSVToolTip}>
                <button
                    className="btn btn-info btn-sm"
                    style={{ float: "right" }}
                    onClick={(e) => {
                        handleShow();
                    }}
                >
                    <i className="fas fa-file-upload"></i>
                </button>
            </OverlayTrigger>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Upload CSV file</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleFormControlFile1"></label>
                            <input
                                type="file"
                                className="form-control-file"
                                id="exampleFormControlFile1"
                                accept={".csv"}
                                ref={inputRef}
                            />
                        </div>
                    </form>
                </Modal.Body>

                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-primary mb-2"
                        onClick={(e) => {
                            // console.log("clicked");
                            handleCSVImport();
                        }}
                    >
                        Upload
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
