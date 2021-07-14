import { Chart, ChartData, LegendItem } from "chart.js";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { OverlayTrigger } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Frequency } from "../../interfaces/enums";
import { FormDataInterface } from "../../interfaces/interface";
import { DataHelper } from "../services/DataHelper";
import { ExportButton } from "./ExportButton";
import { SaveToReportBtn } from "./SaveReportButton";
import Tooltip from "react-bootstrap/Tooltip";

const newLegendClickHandler: typeof Chart.defaults.plugins.legend.onClick = (e, legendItem, legend) => {
    let defaultLegendClickHandler = Chart.defaults.plugins.legend.onClick.bind(legend);
    defaultLegendClickHandler = defaultLegendClickHandler.bind(legend);
    defaultLegendClickHandler(e, legendItem, legend);
    //start here...
    let index = legendItem.datasetIndex;
    let ci = (legend as any).chart as Chart;
    // console.log(e, legendItem, legend);
    // console.log(ci.isDatasetVisible(index));
    // if (index != 0) {
    //     // ci.data.datasets[0].data = [];
    //     ci.hide(1);
    //     ci.hide(2);
    //     ci.hide(3);
    //     ci.render();
    // }
};
const onRenderChart = (chart: Chart, e: any) => {
    // console.log(chart, e);
};
const drawChart = (chart: Chart, data: ChartData) => {
    chart.data = data;
    chart.update();
};
const hideFeatures = (chart: Chart) => {
    let legendItems = (chart as any).legend.legendItems as LegendItem[];
    for (let i = 0; i < legendItems.length; i++) {
        const legendItem = legendItems[i];
        let index = legendItem.datasetIndex;
        if (index != 0) {
            chart.hide(index);
            legendItem.hidden = true;
        }
    }
};

const style: React.CSSProperties = {
    maxWidth: "85vw",
    margin: "0 auto",
    marginBottom: "50px",
};

// const options: ChartOptions<"line"> = {
const options = {
    // scales: {
    //     yAxes: [
    //         {
    //             ticks: {
    //                 // beginAtZero: true,
    //             },
    //         },
    //     ],
    // },

    plugins: {
        legend: {
            onClick: newLegendClickHandler,
        },
    },
    animation: {
        onComplete: onRenderChart,
    },
    interaction: {
        mode: "index",
        axis: "y",
    },
};

interface FormDataInterfaceWrapper {
    chartData: FormDataInterface;
}

export const LineChart: React.FunctionComponent<FormDataInterfaceWrapper> = (props) => {
    let defaultCheck = true;
    let normalize = useRef<boolean>(defaultCheck);
    let frequency = useRef<Frequency>(props.chartData.frequency);
    let chartRef = useRef<Chart>(null);

    let selectRef = useRef<any>();

    let data = useRef<ChartData>(DataHelper.generateChartData(props.chartData, normalize.current, frequency.current));

    function handleChange() {
        let curData = DataHelper.generateChartData(props.chartData, normalize.current, frequency.current);
        data.current = curData;
        if (chartRef.current) {
            drawChart(chartRef.current, curData);
            if (!normalize.current) hideFeatures(chartRef.current as Chart);
        }

        // console.warn("Chart Ref", chartRef.current);
    }

    useEffect(() => {
        //when ever the whole LineChart component is mounted,component is re-rendered;
        frequency.current = props.chartData.frequency;
        selectRef.current.value = frequency.current.toString();
        // console.warn("useEffect LineChart", frequency.current);
        handleChange();
    });

    const renderAverageToolTip = (props: any) => <Tooltip {...props}>Select Frequency for average </Tooltip>;

    return (
        <div className="card" style={style}>
            <div className="card-header d-flex justify-content-end">
                <form className="form-inline">
                    <div className="form-group">
                        <OverlayTrigger placement="top" overlay={renderAverageToolTip}>
                            <select
                                className="form-control"
                                // className="form-select"
                                defaultValue={frequency.current}
                                name="frequency"
                                required
                                ref={selectRef}
                                onChange={(e) => {
                                    let curFrequency = parseInt(e.currentTarget.value) as Frequency;
                                    frequency.current = curFrequency;
                                    handleChange();
                                    // setFrequency(curFrequency);
                                }}
                            >
                                <option value={Frequency.daily}>Daily</option>
                                <option value={Frequency.weekly}>Weekly</option>
                                <option value={Frequency.monthly}>Monthly</option>
                                <option value={Frequency.yearly}>Yearly</option>
                            </select>
                        </OverlayTrigger>
                    </div>
                    <div className="form-group ml-2">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="normalize"
                                defaultChecked={defaultCheck}
                                onChange={(e) => {
                                    let isChecked = e.target.checked;
                                    normalize.current = isChecked;
                                    handleChange();

                                    // console.log(e.target.checked);
                                }}
                            />
                            <label className="form-check-label" htmlFor="normalize">
                                Normalize
                            </label>
                        </div>
                    </div>

                    <ExportButton chart={chartRef as React.RefObject<Chart>} />
                    <SaveToReportBtn chartData={props.chartData}></SaveToReportBtn>
                </form>
            </div>
            <div className="card-body">
                {/* <Line type="line" data={!normalize ? data[0] : data[1]} options={options} ref={ref} /> */}
                <Line type="line" data={data.current} options={options} ref={chartRef} />
            </div>
        </div>
    );
};
