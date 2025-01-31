from flask import Flask, render_template, request, redirect, url_for, jsonify
import pdfplumber  # Alternative to PyMuPDF
import pandas as pd
import re
import nltk
import pymysql

# Initialize Flask app
app = Flask(__name__)

# Download NLTK data
nltk.download('punkt')
nltk.download('averaged_perceptron_tagger')

# MySQL Database connection function
def get_db_connection():
    return pymysql.connect(host="localhost", user="root", password="809095@Aa", database="bank_data")

# Extract text from a PDF statement using pdfplumber
def extract_pdf_data(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text()
    print("Extracted Text:", text)  # Debugging statement
    return text

# Extract transactions from text using Regex
def parse_transaction(text):
    pattern = r'(\d{2}\s\w{3}\s\d{4})\s+([+-]?\d+\.\d{2}|-)\s+([+-]?\d+\.\d{2})\s+(\d+\.\d{2})'
    transaction = re.findall(pattern, text)
    print("Parsed Transaction:", transaction)  # Debugging statement
    return transaction

# Categorize transactions using NLTK (Simple example)
def categorize_transaction(description):
    tokens = nltk.word_tokenize(description)
    tagged = nltk.pos_tag(tokens)
    if "Walmart" in description:
        return "Groceries"
    elif "Uber" in description:
        return "Transport"
    return "Uncategorized"

# Store transactions in the MySQL database
def store_transaction(transaction):
    conn = get_db_connection()
    cursor = conn.cursor()
    for t in transaction:
        date, debit, credit, balance = t
        debit = 0 if debit == '-' else debit
        try:
            cursor.execute("INSERT INTO transaction (date, debit, credit, balance) VALUES (%s, %s, %s, %s)",
                           (date, debit, credit, balance))
            conn.commit()
            print("Transaction added successfully")
        except Exception as e:
            print("Error adding transaction:", str(e))
            conn.rollback()
    cursor.close()
    conn.close()

# Route to render the file upload form
@app.route('/')
def index():
    return render_template('index.html')

# Route to handle the file upload and process the data
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    
    if file.filename.endswith('.pdf'):
        # PDF Parsing
        text = extract_pdf_data(file)
        transaction = parse_transaction(text)
    elif file.filename.endswith('.csv'):
        # CSV Parsing
        df = pd.read_csv(file)
        transaction = df.values.tolist()
    
    store_transaction(transaction)  # Save transactions to DB
    
    # Return transactions as JSON
    transactions = [{'date': t[0], 'amount': float(t[1] if t[1] != '-' else t[2]), 'balance': float(t[3])} for t in transaction]
    return jsonify({'transactions': transactions})

# Route to display stored data
@app.route('/data')
def show_data():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM transaction")
    transaction = cursor.fetchall()
    cursor.close()
    conn.close()
    return render_template('data.html', transaction=transaction)

if __name__ == '__main__':
    app.run(debug=True)