# Example of training and saving an LSTM model for forecasting

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.optimizers import Adam

# Example of preparing your data (assuming it's already preprocessed)
# X_train, y_train are your input features and target output for training
# X_train should have the shape (samples, time_steps, features)

model = Sequential()
model.add(LSTM(50, activation='relu', input_shape=(X_train.shape[1], X_train.shape[2])))
model.add(Dense(1))  # Output layer with 1 node for regression

model.compile(optimizer=Adam(), loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, epochs=20, batch_size=32)

# Save the model to a file
model.save('forecast.h5')
