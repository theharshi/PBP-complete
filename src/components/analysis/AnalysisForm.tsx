import React, { useRef } from "react";
import { useState } from "react";
import { PredictionType } from "../../interfaces/enums";
import { ApiAnalysisResponse, FormDataInterface } from "../../interfaces/interface";
import { LineChart } from "../chart/LineChart";
import { Chart } from "chart.js";
import { DataHelper } from "../services/DataHelper";

export const AnalysisForm: React.FunctionComponent = () => {
    const defaultFromDate = "";
    const defaultToDate = "";
    const defaultPredVar = PredictionType.None;

    //onchange, state change Onclick
    let predVar = useRef<PredictionType>(defaultPredVar);
    let fromDate = useRef<string>(defaultFromDate);
    let toDate = useRef<string>(defaultToDate);
    let chartMessage = useRef<string>("");

    //onclick
    const urlData = useRef<string>("");

    //api response
    const [chartData, setChartData] = useState<FormDataInterface | null>(null);
    const [isloading, setLoading] = useState<boolean>(false);

    // const chart = useRef<Chart>(null);

    function handleSubmit(e: React.MouseEvent) {
        e.preventDefault();
        //NOTE:check if fromDate<=toDate
        if (predVar.current === PredictionType.None) return;
        let defaultUrl = "/api/analyze/";

        let apiUrl = defaultUrl + predVar.current + "/" + fromDate.current + "/" + toDate.current;
        console.log(apiUrl);
        if (apiUrl !== urlData.current) {
            chartMessage.current = "...loading Data";
            setLoading(true);
            urlData.current = apiUrl;
            fetch(urlData.current)
                .then((response) => {
                    console.log(response);
                    if (response.ok) {
                        response.json().then((data: ApiAnalysisResponse) => {
                            console.log(data);
                            chartMessage.current = "";
                            let newChartData = DataHelper.generateAnalysisFormData(data, predVar.current);
                            setChartData(newChartData);
                        });
                    } else {
                        //NOTE:handle error
                        chartMessage.current = response.statusText;
                        console.log(response);
                        setChartData(null);
                    }
                    setLoading(false);
                })
                .catch((e) => {
                    setLoading(false);
                });
        } else {
            if (chartData) {
                chartMessage.current = "";
                // setChartData(newChartData);
            }
        }
    }
    return (
        <div className="container" style={{ marginTop: 20 }}>
            <div className="card">
                <div className="card-header text-center d-inline font-weight-bold">What do you want to Analyze?</div>
                <div className="card-body">
                    <form>
                        <div className="row justify-content-center">
                            <div className="col-lg-auto">
                                <label htmlFor="attribute" className="form-label">
                                    Choose attribute
                                </label>
                                <select
                                    className="form-control "
                                    // className="form-select"
                                    name="attribute"
                                    id="attribute"
                                    required
                                    defaultValue={defaultPredVar}
                                    onChange={(e) => {
                                        predVar.current = parseInt(e.currentTarget.value) as PredictionType;
                                    }}
                                >
                                    <option value={PredictionType.None} disabled hidden>
                                        Analysis attribute
                                    </option>
                                    <option value={PredictionType.Deposit}>Deposits</option>
                                    <option value={PredictionType.Withdrawal}>Withdrawals</option>
                                    <option value={PredictionType.Balance}>Balance</option>
                                </select>
                            </div>
                            <div className="col-lg-auto">
                                <label htmlFor="date-from" className="form-label">
                                    From date
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date-from"
                                    defaultValue={defaultFromDate}
                                    onChange={(e) => {
                                        let newFromDate = e.currentTarget.value;
                                        // fromDate.current = setDateFormat(newFromDate);
                                        fromDate.current = newFromDate;
                                    }}
                                />
                            </div>
                            <div className="col-lg-auto">
                                <label htmlFor="date-to" className="form-label">
                                    To date
                                </label>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="date-to"
                                    defaultValue={defaultToDate}
                                    onChange={(e) => {
                                        let newtoDate = e.currentTarget.value;
                                        // toDate.current = setDateFormat(newtoDate);
                                        toDate.current = newtoDate;
                                    }}
                                />
                            </div>
                            {/* <div className="col-lg-auto align-middle text-center"> */}
                            <div
                                className="col-12 text-center"
                                style={{ marginTop: "10px", marginBottom: "0px", paddingTop: "5px" }}
                            >
                                <button
                                    id="analyze-btn"
                                    type="submit"
                                    className={(!isloading ? "btn btn-primary" : "btn btn-secondary") + " align-middle"}
                                    disabled={isloading}
                                    onClick={(e) => {
                                        handleSubmit(e);
                                    }}
                                >
                                    {isloading
                                        ? [<i className="spinner-border spinner-border-sm" key="1"></i>, "Analyzing"]
                                        : "Analyze"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="container" style={{ marginTop: 50 }}>
                {chartData && !isloading ? (
                    <LineChart chartData={chartData} />
                ) : (
                    <h4 className=" text-lowercase font-weight-bold text-lg-right">{chartMessage.current}</h4>
                )}
            </div>
        </div>
    );
};
