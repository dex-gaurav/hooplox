import joblib
import logging
import numpy as np

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")

try:
    # Load the categorization model
    model = joblib.load("models/categorize.pkl")
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load model: {e}")
    model = None

def categorize_expense(amount):
    """Categorizes an expense based on the given amount."""
    if model is None:
        logging.error("Model is not loaded. Cannot categorize expense.")
        return None
    
    try:
        # Ensure amount is a valid number
        amount = float(amount)
        category = model.predict(np.array([[amount]]))[0]
        return category
    except ValueError:
        logging.error("Invalid input: Amount must be a numeric value.")
    except Exception as e:
        logging.error(f"Error during prediction: {e}")
    
    return None
