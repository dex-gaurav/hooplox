# My Stock Prediction Project

This project is a web application that predicts stock prices using a trained machine learning model. It consists of a backend built with Flask and a frontend developed with HTML, CSS, and JavaScript.

## Project Structure

```
my-project
├── backend
│   ├── app.py               # Main application logic for the backend
│   ├── requirements.txt      # Python dependencies for the backend
│   └── __init__.py          # Marks the backend directory as a Python package
├── frontend
│   ├── index.html           # Main HTML file for the frontend application
│   ├── styles.css           # CSS styles for the frontend application
│   └── app.js               # JavaScript code for the frontend application
├── models
│   └── stock_model.h5       # Trained machine learning model in HDF5 format
└── README.md                # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd my-project
   ```

2. **Install backend dependencies:**
   Navigate to the `backend` directory and install the required Python packages:
   ```
   cd backend
   pip install -r requirements.txt
   ```

3. **Run the backend server:**
   Start the Flask application:
   ```
   python app.py
   ```

4. **Open the frontend:**
   Open `frontend/index.html` in a web browser to access the application.

## Usage Guidelines

- The backend provides an endpoint `/predict_stock` that accepts POST requests with stock prices to predict future prices.
- The frontend allows users to input stock prices and view predictions.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.