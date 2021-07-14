export enum Frequency {
    // None=-1,
    weekly = 0,
    monthly,
    yearly,
    daily,
}
export enum PredictionType {
    Deposit = 0,
    Withdrawal,
    Balance,
    None,
}
export enum ColumnSeq {
    Date = 0,
    Deposit,
    Withdrawal,
    Balance,
    "Interest Inflation Gap",
    "Average Pay",
    "Emplyment Rate",
}

export enum ReportType {
    All = 0,
    Favourites,
    Predicted,
    Historical,
}
// let predictionTypeMap = new Map<PredictionType, string>();
// predictionTypeMap.set(PredictionType.Depsits, "Depsits");
// predictionTypeMap.set(PredictionType.Withdrawals, "Withdrawals");
// predictionTypeMap.set(PredictionType.Balance, "Balance");
// export {predictionTypeMap  };

// export enum ColNumber {
//     Igap = 0,
//     AvgPay = 1,
//     EmpRt = 2,
//     PredAtt = 3,
// }
