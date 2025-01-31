from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import pandas as pd

# Load the trained model
model = tf.keras.models.load_model("models/stock_model.h5")

app = Flask(__name__)

@app.route('/predict_stock', methods=['POST'])
def predict_stock():
    data = request.json['prices']  # Get past 60 days of stock prices
    data = np.array(data).reshape(1, 60, 1)
    scaler = MinMaxScaler(feature_range=(0, 1))
    data = scaler.fit_transform(data)
    prediction = model.predict(data)
    prediction = scaler.inverse_transform(prediction)
    return jsonify({'predicted_price': prediction[0][0]})

if __name__ == '__main__':
    app.run(debug=True)