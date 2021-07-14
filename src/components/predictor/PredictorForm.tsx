import { Chart } from "chart.js";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { Frequency, PredictionType } from "../../interfaces/enums";
import { ApiPredRequest, ApiPredResponse, FormDataInterface } from "../../interfaces/interface";
import { DataHelper } from "../services/DataHelper";
import { LineChart } from "../chart/LineChart";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import "../Reports/Card.css";
import { ImportCSVBtn } from "./ImportCSVBtn";

export interface FormTableRow {
    gap: string;
    avgPay: string;
    emprt: string;
    [key: string]: string;
}

export const PredictorForm: React.FunctionComponent = (prop: any) => {
    const inputType: "number" | "text" = "text";
    let defaultFrequency = Frequency.weekly;
    let counter = useRef(0);

    let predType = useRef(PredictionType.None);
    let frequency = useRef<Frequency>(defaultFrequency);
    // const chart = useRef<Chart>(null);

    const [inputList, setInputList] = useState<FormTableRow[]>([{ gap: "", avgPay: "", emprt: "" }]);
    // useEffect(() => {
    // // Update the document title using the browser API
    // console.warn("inputList", inputList, prop);
    // }, [inputList]);
    const [isloading, setLoading] = useState<boolean>(false);
    const [isEditng, setEditng] = useState<boolean>(false);
    const [chartData, setChartData] = useState<FormDataInterface | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setEditng(true);
        const { name, value } = e.target;

        //is entered value a number or has only 1 {"-","."}
        let split = value.split(" ");
        let isExcelData = false;
        if (!DataHelper.isNumeric(value) && split.length > 0) {
            let rowData = split[0].split("\t");
            if (rowData.length == 3) {
                isExcelData = true;
            }
        }
        // console.warn("VALUE:", e.target.value, isExcelData);
        let isValidInput = isExcelData || DataHelper.isNumeric(value) || value == "-" || value == "";
        let list: FormTableRow[] = [];
        if (!isValidInput) {
            e.target.value = "";
            return;
        } else if (isExcelData) {
            let data = DataHelper.stringToTable(value);
            for (let i = 0; i < data[0].length; i++) {
                list.push({
                    gap: data[0][i] + "",
                    avgPay: data[1][i] + "",
                    emprt: data[2][i] + "",
                });
            }
            setInputList(list);
        } else {
            list = [...inputList];
            if (list[index] === undefined) {
                list[index] = { gap: "", avgPay: "", emprt: "" };
            }
            list[index][name] = value;
            setInputList(list);
        }
    };
    const handleAddInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        setEditng(true);
        e.preventDefault();
        const list = [...inputList];
        let prevInput = list[list.length - 1];
        list.push({ gap: prevInput.gap, avgPay: prevInput.avgPay, emprt: prevInput.emprt });
        setInputList(list);
        counter.current = counter.current + 1;
    };
    const handleRemoveInput = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, index: number) => {
        setEditng(true);
        e.preventDefault();
        const list = [...inputList];
        list.splice(index, 1);
        setInputList(list);
        counter.current = counter.current - 1;
    };
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEditng(false);
        e.preventDefault();
        let features = DataHelper.getFeaturesTable(inputList);
        let request: ApiPredRequest = {
            frequency: frequency.current as Frequency,
            count: inputList.length,
            type: predType.current,
            columns: ["Interest Inflation Gap", "Average Pay", "Employment Rate"],
            features,
            // features: [
            //     [-0.5, -0.55, -0.45, -0.4],
            //     [100, 120, 110, 124],
            //     [90, 89, 88, 87],
            // ],
        };
        console.log("request", request);
        const requestOptions: RequestInit = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(request),
        };
        // chartMessage.current = "...loading Data";
        setLoading(true);
        let url = "/api/predict/";
        fetch(url, requestOptions)
            .then((response) => {
                if (response.ok) {
                    response.json().then((data) => {
                        console.log("response", response);
                        let chartData = buildFormData(data, request);
                        // console.log("chartData", chartData);
                        setChartData(chartData);
                    });
                } else {
                    //NOTE:handle error
                    // chartMessage.current = response.statusText;
                    console.error(response);
                    setChartData(null);
                }
                setLoading(false);
            })
            .catch((e) => {
                setLoading(false);
            });
    };

    function buildFormData(apiResponse: ApiPredResponse, apiRequest: ApiPredRequest) {
        let features = apiRequest.features;
        let expandedFeatures: number[][] = [[], [], []];
        let frqCount = apiResponse.Y.length / features[0].length;
        for (let i = 0; i < features.length; i++) {
            let featureArray: number[] = features[i];
            for (let j = 0; j < featureArray.length; j++) {
                let featureValue = featureArray[j];
                //repeat frqCount times
                for (let k = 0; k < frqCount; k++) {
                    expandedFeatures[i].push(featureValue);
                }
            }
        }
        let predFormData: FormDataInterface = {
            count: apiRequest.count,
            type: apiRequest.type,
            frequency: apiRequest.frequency,
            columns: [
                "Date",
                DataHelper.getKey(PredictionType, predType.current),
                "Interest Inflation Gap",
                "Average Pay",
                "Employment Rate",
            ],
            data: [apiResponse.X, apiResponse.Y, ...expandedFeatures],
        };
        return predFormData;
    }
    // const renderImportCSVToolTip = (props: any) => <Tooltip {...props}>Import a csv file </Tooltip>;
    const renderExcelDataToolTip = (props: any) => (
        <Tooltip {...props}>Enter parameters or paste from excel directly in the 1st cell </Tooltip>
    );
    const renderFrequencyCSVToolTip = (props: any) => <Tooltip {...props}>Modify Frequency</Tooltip>;

    return (
        <div>
            <div className="container" style={{ marginTop: 20 }}>
                <div className="card text-center">
                    <div className="card-header text-center d-inline">
                        <div className="row">
                            <div className="col-11">
                                <i className="font-weight-bold">Prediction Parameters </i>
                                <OverlayTrigger placement="top" overlay={renderExcelDataToolTip}>
                                    <i className="fas fa-info-circle"></i>
                                </OverlayTrigger>
                            </div>

                            <div className="col-1">
                                <ImportCSVBtn setInputList={setInputList}></ImportCSVBtn>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <Scrollbars style={{ height: 300 }}>
                            <table className="table table-bordered table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: "20%" }}>
                                            <OverlayTrigger placement="top" overlay={renderFrequencyCSVToolTip}>
                                                <select
                                                    className="form-control"
                                                    // className="form-select"
                                                    defaultValue={defaultFrequency}
                                                    name="Frequency"
                                                    required
                                                    onChange={(e) => {
                                                        frequency.current = parseInt(
                                                            e.currentTarget.value
                                                        ) as Frequency;
                                                        setEditng(true);
                                                    }}
                                                >
                                                    <option value={Frequency.weekly}>Weekly</option>
                                                    <option value={Frequency.monthly}>Monthly</option>
                                                    <option value={Frequency.yearly}>Yearly</option>
                                                </select>
                                            </OverlayTrigger>
                                        </th>
                                        <th scope="col" style={{ width: "20%" }}>
                                            Interest Inflation Gap
                                        </th>
                                        <th scope="col" style={{ width: "20%" }}>
                                            Average Pay
                                        </th>
                                        <th scope="col" style={{ width: "20%" }}>
                                            Employment Rate
                                        </th>
                                        <th scope="col" style={{ width: "20%" }}>
                                            Add/Remove
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inputList.map((x, i) => {
                                        return (
                                            <tr key={i}>
                                                <th scope="row" style={{ width: "20%" }}>
                                                    {i + 1}
                                                </th>
                                                <td width="20%">
                                                    <input
                                                        className="form-control"
                                                        type={inputType}
                                                        name="gap"
                                                        placeholder="Enter Interest Inflation Gap"
                                                        value={x.gap}
                                                        onChange={(e) => handleChange(e, i)}
                                                    />
                                                </td>
                                                <td width="20%">
                                                    <input
                                                        className="form-control"
                                                        type={inputType}
                                                        name="avgPay"
                                                        placeholder="Enter Average Pay"
                                                        //  style={mr20}
                                                        value={x.avgPay}
                                                        onChange={(e) => handleChange(e, i)}
                                                    />
                                                </td>
                                                <td width="20%">
                                                    <input
                                                        className="form-control"
                                                        type={inputType}
                                                        name="emprt"
                                                        placeholder="Enter Employment Rate"
                                                        //  style={mr5}
                                                        value={x.emprt}
                                                        onChange={(e) => handleChange(e, i)}
                                                    />
                                                </td>
                                                <td width="20%">
                                                    {inputList.length !== 1 && (
                                                        <button
                                                            onClick={(e) => handleRemoveInput(e, i)}
                                                            className="btn btn-danger text-center"
                                                        >
                                                            <i className="fa fa-minus-circle" aria-hidden="true"></i>
                                                        </button>
                                                    )}
                                                    &nbsp;
                                                    {i === inputList.length - 1 && (
                                                        <button
                                                            className="btn btn-primary text-center"
                                                            onClick={(e) => handleAddInput(e, i)}
                                                        >
                                                            <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </Scrollbars>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">
                            <div className="d-flex justify-content-center ">
                                <form className="row">
                                    <div className="col-6">
                                        <label htmlFor="predictAttribute" className="font-weight-bold">
                                            What do you want to predict?
                                        </label>
                                    </div>
                                    <div className="col-5">
                                        <select
                                            className="form-control"
                                            // className="form-select"
                                            name="predictAttribute"
                                            required
                                            defaultValue={PredictionType.None}
                                            onChange={(e) => {
                                                predType.current = parseInt(e.currentTarget.value);
                                                setEditng(true);
                                            }}
                                        >
                                            <option value={PredictionType.None} disabled hidden>
                                                Choose attribute
                                            </option>
                                            <option value={PredictionType.Deposit}>Deposits</option>
                                            <option value={PredictionType.Withdrawal}>Withdrawals</option>
                                            <option value={PredictionType.Balance}>Balance</option>
                                        </select>
                                    </div>
                                    <div className="col-1">
                                        <button
                                            id="predict-btn"
                                            type="submit"
                                            className={!isloading ? "btn btn-primary" : "btn btn-secondary"}
                                            disabled={isloading}
                                            onClick={(e) => {
                                                handleSubmit(e);
                                            }}
                                        >
                                            {isloading
                                                ? [<i className="spinner-border spinner-border-sm" key="1"></i>]
                                                : "Predict"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container" style={{ marginTop: 50 }}>
                {chartData && !isloading && !isEditng ? <LineChart chartData={chartData} /> : null}
            </div>
        </div>
    );
};
