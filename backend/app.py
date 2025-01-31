from flask import Flask, request, jsonify
import numpy as np
import tensorflow as tf
import joblib
import firebase_admin
from firebase_admin import credentials, db
import PyPDF2
import os
import re

app = Flask(__name__)

# Initialize Firebase
cred = credentials.Certificate("E:/HOOPLOX/backend/firebase_key.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://hooplox-default-rtdb.firebaseio.com/'
})

# Load models
forecast_model = tf.keras.models.load_model("E:/HOOPLOX/backend/models/forecast.h5")
categorize_model = joblib.load("E:/HOOPLOX/backend/models/categorize.pkl")
stock_predictor_model = tf.keras.models.load_model("E:/HOOPLOX/backend/models/stock_predictor.h5")

@app.route('/predict_spending', methods=['POST'])
def predict_spending():
    data = request.json
    past_spending = data['past_spending']
    input_data = np.array(past_spending).reshape(1, len(past_spending), 1)
    prediction = forecast_model.predict(input_data)[0][0]
    return jsonify({'prediction': prediction})

@app.route('/categorize_expense', methods=['POST'])
def categorize_expense():
    data = request.json
    amount = data['amount']
    category = categorize_model.predict([[amount]])[0]
    return jsonify({'category': category})

@app.route('/predict_stock', methods=['POST'])
def predict_stock():
    data = request.json
    stock_data = data['stock_data']
    input_data = np.array(stock_data).reshape(1, len(stock_data), 1)
    prediction = stock_predictor_model.predict(input_data)[0][0]
    return jsonify({'prediction': prediction})

@app.route('/fetch_transactions', methods=['GET'])
def fetch_transactions():
    user_id = request.args.get('user_id')
    ref = db.reference(f'users/{user_id}/transactions')
    transactions = ref.get()
    return jsonify(transactions)

@app.route('/upload-pdf', methods=['POST'])
def upload_pdf():
    if 'pdf' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['pdf']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and file.filename.endswith('.pdf'):
        file_path = os.path.join('/tmp', file.filename)
        file.save(file_path)

        # Extract text from PDF
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfFileReader(f)
            text = ''
            for page_num in range(reader.numPages):
                page = reader.getPage(page_num)
                text += page.extract_text()

        os.remove(file_path)

        # Extract data from text
        transactions = []
        lines = text.split('\n')
        for line in lines:
            match = re.match(r'(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2} [APM]{2})\s+(.+?)\s+(\d+\.\d{2})', line)
            if match:
                date, time, description, amount = match.groups()
                transactions.append({
                    'date': date,
                    'time': time,
                    'description': description,
                    'amount': float(amount)
                })

        return jsonify({'transactions': transactions})

    return jsonify({'error': 'Invalid file format'}), 400

if __name__ == '__main__':
    app.run(debug=True)