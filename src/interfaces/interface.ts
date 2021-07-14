import { Frequency, PredictionType } from "./enums";

export interface ApiPredRequest {
    frequency: Frequency;
    count: number;
    type: PredictionType;
    columns: string[];
    features: number[][];
}
export interface ApiPredResponse {
    X: number[];
    Y: number[];
}
export interface ApiAnalysisResponse {
    Date: string[];
    "Interest Inflation Gap": number[];
    "Average Pay": number[];
    "Emplyment Rate": number[];
    Deposit?: number;
    Withdrawal?: number[];
    Balance?: number[];
}

export interface FormDataInterface {
    frequency: Frequency;
    count: number;
    type: PredictionType;
    columns: string[];
    data: (number | string)[][];
}

export interface ReportData extends FormDataInterface {
    //date->PredictionType->{gap->avg pay->empt}
    emailId: string;
    favourite: boolean;
    reportName: string;
    id?: string;
    createdAt?: string;
    updatedAt?: string;
}
