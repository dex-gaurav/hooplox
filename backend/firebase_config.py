import firebase_admin
from firebase_admin import credentials, db
import os

# Load Firebase credentials from firebase_key.json
cred_path = os.path.join(os.path.dirname(__file__), "firebase_key.json")
cred = credentials.Certificate(cred_path)  # Make sure this file is inside backend/
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://hooplox-default-rtdb.firebaseio.com/"  # Replace with your Firebase DB URL
})

# Function to fetch all transactions from Firebase
def get_transactions():
    ref = db.reference("/transactions")
    return ref.get()

# Function to add a new transaction
def add_transaction(amount, category):
    ref = db.reference("/transactions")
    new_transaction = {
        "amount": amount,
        "category": category
    }
    ref.push(new_transaction)
    return "Transaction added successfully"