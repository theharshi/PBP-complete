def predict_date(type,fromDate,toDate,data,model):
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
    X = data.iloc[idx:idx + count, 10]
    X = X.tolist()
    x_train = data.iloc[idx:idx + count, 0:8]
    prediction = model.predict(x_train)
    prediction = prediction.tolist()
    # print(prediction.shape)
    # output =prediction
    # output = round(prediction[0], 2)
    return jsonify({"Y": prediction,"X":X})