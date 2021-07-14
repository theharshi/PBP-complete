import { Chart, ChartData, ChartDataset } from "chart.js";
import { ColumnSeq, Frequency, PredictionType } from "../../interfaces/enums";
import { ApiAnalysisResponse, FormDataInterface } from "../../interfaces/interface";
import { FormTableRow } from "../predictor/PredictorForm";

export class DataHelper {
    static isNumeric(num: any) {
        return (typeof num === "number" || (typeof num === "string" && num.trim() !== "")) && !isNaN(num as number);
    }
    static stringToTable(str: string) {
        let colString = str.split(" ");
        let colCount = colString[0].split("\t").length;
        let data: (number | string | null)[][] = [];
        for (let i = 0; i < colCount; i++) {
            data.push([]);
        }
        for (let i = 0; i < colString.length; i++) {
            let colData = colString[i].split("\t");

            for (let j = 0; j < colCount; j++) {
                const ele = colData[j];
                let cellData: number | string | null = ele;
                if (DataHelper.isNumeric(ele)) {
                    cellData = parseFloat(ele);
                }
                data[j].push(cellData);
            }
        }
        return data;
    }
    static random(l: number, h: number) {
        let rd = Math.random() * (h - l) + l;
        return rd;
    }
    static genrateRandomColor() {
        let [r, g, b] = [DataHelper.random(0, 225), DataHelper.random(0, 225), DataHelper.random(0, 225)];
        return [r, g, b];
    }
    static normalizeData(data: number[], l: number = 0, h: number = 1) {
        let min = Infinity;
        let max = -Infinity;
        for (const x of data) {
            min = Math.min(min, x);
            max = Math.max(max, x);
        }
        let normalizedData: number[] = [];
        for (const x of data) {
            let xStd = (x - min) / (max - min);
            let xNorm = xStd * (h - l) + l;
            normalizedData.push(xNorm);
        }
        // console.log(normalizedData);
        return normalizedData;
    }

    // generateChartData(chartData: FormDataInterface): ChartData[] {
    //     let labels = chartData.data[0] as string[];
    //     let datasets: ChartDataset[][] = [[], []];
    //     let a2 = 0.4;
    //     for (let i = 1; i < chartData.data.length; i++) {
    //         let colData = chartData.data[i] as number[];
    //         const colName = chartData.columns[i];
    //         let [r, g, b] = DataHelper.genrateRandomColor();
    //         let a1 = 1;
    //         // if (i !== 1) {
    //         //     a1 = 0.3;
    //         // }
    //         let dataset: ChartDataset = {
    //             label: colName,
    //             data: colData,
    //             borderColor: `rgba(${r}, ${g}, ${b},${a1})`,
    //             backgroundColor: `rgba(${r}, ${g}, ${b},${a2})`,
    //             // normalized: true,
    //         };
    //         let datasetNormalized: ChartDataset = {
    //             label: colName,
    //             data: DataHelper.normalizeData(colData),
    //             borderColor: `rgba(${r}, ${g}, ${b},${a1})`,
    //             backgroundColor: `rgba(${r}, ${g}, ${b},${a2})`,
    //             // normalized: true,
    //         };
    //         datasets[0].push(dataset);
    //         datasets[1].push(datasetNormalized);
    //     }

    //     const data: ChartData[] = [
    //         {
    //             labels,
    //             datasets: datasets[0],
    //         },
    //         {
    //             labels,
    //             datasets: datasets[1],
    //         },
    //     ];
    //     console.warn("generateChartData called");
    //     return data;
    //     // const data: ChartData={
    //     //     labels: labels,
    //     //     datasets: [
    //     //         {
    //     //             label: "Predicted " + label,
    //     //             data: dataYP,
    //     //             fill: false,
    //     //             backgroundColor: "rgb(255, 99, 132)",
    //     //             borderColor: "rgba(255, 99, 132, 1)",
    //     //         },
    //     //         {
    //     //             label: "Historical " + label,
    //     //             data: dataYH,
    //     //             fill: false,
    //     //             backgroundColor: "rgb(125, 90, 120)",
    //     //             borderColor: "rgba(125, 90, 120, 1)",
    //     //         },
    //     //     ],
    //     // };
    // }

    static averageBy(colData: number[], freq: Frequency) {
        let cntArray = [7, 30, 365, 1];
        let cnt = cntArray[freq];
        if (cnt == 1) return Array.from(colData);
        let avg: number[] = [];
        let sum = 0;
        for (let i = 0; i < colData.length; i++) {
            const ele = colData[i];
            sum = sum + ele;
            if ((i + 1) % cnt == 0) {
                avg.push(sum / cnt);
                sum = 0;
            }
        }
        if (colData.length % cnt > 0) avg.push((sum / colData.length) % cnt);
        return avg;
    }
    static getDatesForFrq(colData: string[], freq: Frequency) {
        let cntArray = [7, 30, 365, 1];
        let cnt = cntArray[freq];
        if (cnt == 1) return Array.from(colData);
        let dates: string[] = [];
        for (let i = 0; i < colData.length; i++) {
            const date = colData[i];
            if ((i + 1) % cnt == 0) {
                dates.push(date);
            }
        }
        if (colData.length % cnt > 0) dates.push(colData[colData.length - 1]);
        return dates;
    }
    static convertToNumber(colData: (string | number)[]) {
        let newColData: number[] = [];
        for (let i = 0; i < colData.length; i++) {
            const ele = colData[i];
            if (DataHelper.isNumeric(ele)) {
                newColData.push(parseFloat(ele as string));
            } else {
                newColData.push(ele as number);
            }
        }
        return newColData;
    }
    static generateChartData(chartData: FormDataInterface, normalize: boolean, freq: Frequency): ChartData {
        console.log("generateChartDataParam", chartData, normalize, freq);
        let labels = chartData.data[0] as string[];
        let datasets: ChartDataset[] = [];
        let a2 = 0.4;
        labels = DataHelper.getDatesForFrq(labels, freq);
        for (let i = 1; i < chartData.data.length; i++) {
            let colDataRaw = chartData.data[i];
            let colData = <number[]>DataHelper.convertToNumber(colDataRaw);
            colData = normalize ? DataHelper.normalizeData(colData) : colData;
            // console.log("Normailzed Data", Array.from(colData));
            colData = DataHelper.averageBy(colData, freq);
            const colName = chartData.columns[i];
            let [r, g, b] = DataHelper.genrateRandomColor();
            let a1 = 1;
            // if (i !== 1) {
            //     a1 = 0.3;
            // }
            let dataset: ChartDataset = {
                label: colName,
                data: colData,
                borderColor: `rgba(${r}, ${g}, ${b},${a1})`,
                backgroundColor: `rgba(${r}, ${g}, ${b},${a2})`,
                // normalized: true,
            };
            datasets.push(dataset);
        }

        const data: ChartData = {
            labels,
            datasets: datasets,
        };

        // console.warn("generateChartData called");
        return data;
        // const data: ChartData={
        //     labels: labels,
        //     datasets: [
        //         {
        //             label: "Predicted " + label,
        //             data: dataYP,
        //             fill: false,
        //             backgroundColor: "rgb(255, 99, 132)",
        //             borderColor: "rgba(255, 99, 132, 1)",
        //         },
        //         {
        //             label: "Historical " + label,
        //             data: dataYH,
        //             fill: false,
        //             backgroundColor: "rgb(125, 90, 120)",
        //             borderColor: "rgba(125, 90, 120, 1)",
        //         },
        //     ],
        // };
    }

    static getFeaturesTable(features: FormTableRow[]) {
        let apiFeatureTable: number[][] = [[], [], []];
        for (const feature of features) {
            apiFeatureTable[0].push(parseFloat(feature.gap));
            apiFeatureTable[1].push(parseFloat(feature.avgPay));
            apiFeatureTable[2].push(parseFloat(feature.emprt));

            // for (const key in feature as Object) {
            //     if (Object.prototype.hasOwnProperty.call(feature, key)) {
            //         const ele: number = (<any>feature)[key];
            //         apiFeatureRow.push(ele);
            //     }
            // }
        }
        return apiFeatureTable;
    }
    static getKey(object: any, value: any) {
        for (const key in object as Object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const curValue: number = (<any>object)[key];
                if (curValue === value) {
                    return key;
                }
            }
        }
        return "";
    }
    static cloneObject(object: Object) {
        let clone: Object = {};
        for (const key in object as Object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                const value: number = (<any>object)[key];
                (clone as any)[key] = value;
            }
        }
        return clone;
    }
    static transformMatrix(data: (string | number)[][], maxRowCount: number) {
        let transpose: (string | number | null)[][] = [];
        for (let rowIndex = 0; rowIndex < maxRowCount; rowIndex++) {
            let row: (string | number | null)[] = [];
            for (let colIndex = 0; colIndex < data.length; colIndex++) {
                let ele = null;
                if (rowIndex < data[colIndex].length) {
                    ele = data[colIndex][rowIndex];
                }
                row.push(ele);
            }
            transpose.push(row);
        }
        return transpose;
    }
    static chartToCSVData(chart: Chart) {
        let colNames: string[] = ["Dates"];
        let chartData: (string | number)[][] = [chart.data.labels as string[]];
        let maxRowCount = 0;
        let chartDatasets = chart.data.datasets;
        for (let i = 0; i < chartDatasets.length; i++) {
            const chartDataset = chartDatasets[i];
            let label = <string>chartDataset.label;
            let colData = <number[]>chartDataset.data;
            if (chart.isDatasetVisible(i)) {
                colNames.push(label);
                chartData.push(colData);
                maxRowCount = Math.max(colData.length, maxRowCount);
            }
        }
        if (maxRowCount == 0) {
            return [];
        }
        chartData[0] = chartData[0].slice(0, maxRowCount);
        let csvData: (string | number | null)[][] = [colNames];
        csvData.push(...DataHelper.transformMatrix(chartData, maxRowCount));
        return csvData;
    }
    static generateAnalysisFormData(apiResponse: ApiAnalysisResponse, type: PredictionType) {
        let frequency: Frequency = Frequency.daily;
        let count: number = -1;
        let columns: string[] = Object.keys(apiResponse);
        columns.sort((c1, c2) => {
            let x1 = (ColumnSeq as any)[c1];
            let x2 = (ColumnSeq as any)[c2];
            return x1 - x2;
        });
        let data: (number | string)[][] = [];
        for (const column of columns) {
            data.push((apiResponse as any)[column]);
        }
        let formData: FormDataInterface = {
            columns,
            count,
            type,
            data,
            frequency,
        };
        return formData;
    }
}
