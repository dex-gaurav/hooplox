import yfinance as yf
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

# Fetch stock data (Apple - AAPL)
stock = yf.Ticker("AAPL")
data = stock.history(period="1mo")["Close"].values  # Get closing prices for last 1 month

# Prepare dataset for prediction
X = np.array(range(len(data))).reshape(-1, 1)
y = np.array(data)

# Train a Linear Regression model
model = LinearRegression().fit(X, y)

# Predict stock price for next day
future_day = np.array([[len(data) + 1]])
predicted_price = model.predict(future_day)

print(f"✅ Predicted AAPL Stock Price Tomorrow: ${predicted_price[0]:.2f}")
