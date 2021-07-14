import numpy as np
from flask import Flask, request, jsonify, render_template, url_for
from data import *
import numpy as np
import joblib
# from sklearn import joblib
import pandas as pd
# from xgboost import XGBRegressor
import pickle
Models = ['./models/Model_deposits.pkl','./models/Model_withdrawal.pkl']

app = Flask(__name__)


@app.route('/')
def home():
    return 'Hello World'
# @app.route('/api/predict/<int:type>/<int:count>',methods = ['GET'])
# def predict(count):
#     x_train = data.iloc[0:count,0:8]
#     model = pickle.load(open(Models[type], 'rb'))
#     prediction = model.predict(x_train)
#     prediction = prediction.tolist()
#     return jsonify({" predictions " : prediction })
#
#
@app.route('/api/analyze/<int:type>/<fromDate>/<toDate>', methods=['GET'])
def predict_date(type,fromDate,toDate):
    data = create_data2()
    print(data)
    idx = 0
    st = 0
    en = 0
    for i in range(len(data)):
        if data.iloc[i, 10] == fromDate :
            st = i
            break
    for i in range(len(data)):
        if data.iloc[i, 10] == toDate :
            en = i
            break
    count = en - st
    idx = st
    print("count ",count)
    print("st en ",st, " ",en)
    # X = data.iloc[idx:idx + count, 10]
    # X = X.tolist()
    data = data.iloc[idx:idx + count, :]
    date = data['date']
    date = date.tolist()
    igap = data['Gap']
    igap = igap.tolist()
    emprt = data['Employment Rate']
    emprt = emprt.tolist()
    average_pay = data['Average Pay']
    average_pay = average_pay.tolist()
    interest_rate = data['Interest Rate']
    interest_rate = interest_rate.tolist()
    inflation_rate = data['Inflation Rate']
    inflation_rate = inflation_rate.tolist()
    deposits = data['Deposit']
    deposits = deposits.tolist()
    withdrawal = data['Withdrawal']
    withdrawal = withdrawal.tolist()
    balance = np.array(deposits) - np.array(withdrawal)
    balance = balance.tolist()
    if type == 0:
        return jsonify(
            {
                "Date":date,
                "Interest Inflation Gap":igap,
                "Employment Rate":emprt,
                "Average Pay":average_pay,
                # "Interest Rate":interest_rate,
                # "Inflation Rate":inflation_rate,
                "Deposit":deposits
            }
        )
    elif type == 1:
        return jsonify(
            {
                "Date": date,
                "Interest Inflation Gap": igap,
                "Employment Rate": emprt,
                "Average Pay": average_pay,
                # "Interest Rate": interest_rate,
                # "Inflation Rate": inflation_rate,
                "Withdrawal": withdrawal
            }
        )
    else:
        return jsonify(
            {
                "Date": date,
                "Interest Inflation Gap": igap,
                "Employment Rate": emprt,
                "Average Pay": average_pay,
                # "Interest Rate": interest_rate,
                # "Inflation Rate": inflation_rate,
                "Balance": balance
            }
        )

@app.route('/api/predict/', methods=['GET','POST'])
def predict2():
    params = request.get_json(force=True)
    x_test,dates = create_data(params=params)
    print(x_test)
    type = params["type"]
    if type == 2:
        model1 = pickle.load(open(Models[0], 'rb'))
        deposits = model1.predict(x_test)
        model2 = pickle.load(open(Models[1], 'rb'))
        withdrawal = model2.predict(x_test)
        deposits = np.array(deposits)
        withdrawal = np.array(withdrawal)
        balance = deposits - withdrawal
        balance = balance.tolist()
        return jsonify({"Y": balance, "X": dates})
    else:
        model = pickle.load(open(Models[type], 'rb'))
        y_pred = model.predict(x_test)
        y_pred = y_pred.tolist()
        print(y_pred)
        return jsonify({"Y": y_pred, "X": dates})






if __name__ == '__main__':
    app.run(debug=True)