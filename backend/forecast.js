import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import { TrendingUp, TrendingDown } from "lucide-react";

const InvestmentForecast = () => {
  const [spendingHistory, setSpendingHistory] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [investmentData, setInvestmentData] = useState([]);

  const handlePredict = async () => {
    const spendingArray = spendingHistory
      .split(",")
      .map((num) => parseFloat(num.trim()));

    if (spendingArray.some(isNaN)) {
      alert("Please enter valid numbers separated by commas.");
      return;
    }

    // Simulated API call for prediction
    const response = await fetch("/api/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ past_spending: spendingArray }),
    });

    const data = await response.json();
    setPrediction(data.prediction);
    setInvestmentData([...spendingArray, data.prediction]);
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <Card className="w-full max-w-2xl p-6 shadow-xl bg-white rounded-2xl">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">Expense Forecast AI</h2>
          <Input
            type="text"
            placeholder="Enter past expenses (comma-separated)"
            value={spendingHistory}
            onChange={(e) => setSpendingHistory(e.target.value)}
            className="mb-4 p-2 border-2 border-gray-300 rounded-lg w-full"
          />
          <Button onClick={handlePredict} className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg">
            Predict Future Expenses
          </Button>
          {prediction !== null && (
            <div className="text-lg font-semibold text-center flex items-center justify-center">
              <span className="mr-2 text-green-600">Predicted Spending: ${prediction.toFixed(2)}</span>
              {prediction > investmentData[investmentData.length - 2] ? (
                <TrendingUp className="text-red-500" />
              ) : (
                <TrendingDown className="text-green-500" />
              )}
            </div>
          )}
        </CardContent>
      </Card>
      {investmentData.length > 1 && (
        <Card className="w-full max-w-2xl p-6 mt-6 shadow-xl bg-white rounded-2xl">
          <CardContent>
            <h2 className="text-lg font-bold mb-4 text-center text-blue-600">Expense Trend Analysis</h2>
            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <Line
                data={{
                  labels: investmentData.map((_, index) => `Month ${index + 1}`),
                  datasets: [
                    {
                      label: "Past Expenses",
                      data: investmentData.slice(0, -1),
                      borderColor: "#3b82f6",
                      backgroundColor: "rgba(59, 130, 246, 0.2)",
                      fill: true,
                    },
                    {
                      label: "Predicted Expense",
                      data: investmentData,
                      borderColor: "#ef4444",
                      backgroundColor: "rgba(239, 68, 68, 0.2)",
                      fill: true,
                      borderDash: [5, 5],
                    },
                  ],
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestmentForecast;
