import joblib

# Load the categorization model
model = joblib.load("models/categorize.pkl")

def categorize_expense(amount):
    # Predict the category based on the amount
    category = model.predict([[amount]])[0]
    return category