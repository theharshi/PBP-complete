import { Chart } from "chart.js";
import React from "react";
import { useState } from "react";
import { CSVLink, CSVDownload } from "react-csv";
import { useEffect } from "react";
import { DataHelper } from "../services/DataHelper";

import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

interface ChartInterafceWrapper {
    chart: React.RefObject<Chart>;
}
export const ExportButton = (props: ChartInterafceWrapper) => {
    let [csvReport, setCsvReport] = useState<any>(null);
    const renderExportToolTip = (props: any) => <Tooltip {...props}>Download as CSV </Tooltip>;
    function handleExport(e: React.MouseEvent) {
        let chart = (props.chart as any).current as Chart;
        // console.log(chart);
        // return;
        if (!chart) {
            //NOTE:handle Exception
            return;
        }
        let cvsData = DataHelper.chartToCSVData(chart);

        const newCsvReport = {
            data: cvsData,
            filename: "edew.csv",
        };
        // console.log(newCsvReport);
        setCsvReport(newCsvReport);
    }
    return (
        <OverlayTrigger placement="top" overlay={renderExportToolTip}>
            <button
                id="export-btn"
                type="button"
                className="btn btn-secondary ml-3 text-white"
                onClick={(e) => {
                    // console.log("clicked");
                    handleExport(e);
                    setTimeout(() => {
                        setCsvReport(null);
                    }, 1000);
                }}
            >
                <i className="fas fa-file-download"></i>
                {csvReport ? <CSVDownload {...csvReport} target="_self" /> : null}
                <div id="downloadLink"></div>
            </button>
        </OverlayTrigger>
    );
};
