import React, { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import "chart.js/auto";

const StockInsights = () => {
  const [stockData, setStockData] = useState([]);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [ticker, setTicker] = useState("AAPL");

  useEffect(() => {
    fetchStockData();
  }, [ticker]);

  const fetchStockData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.example.com/stocks?ticker=${ticker}`);
      setStockData(response.data.prices);
      predictStockPrice(response.data.prices);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    }
    setLoading(false);
  };

  const predictStockPrice = async (prices) => {
    try {
      const response = await axios.post("https://your-flask-api.com/predict", { data: prices });
      setPredictedPrice(response.data.prediction);
    } catch (error) {
      console.error("Error predicting stock price:", error);
    }
  };

  const chartData = {
    labels: stockData.map((_, index) => `Day ${index + 1}`),
    datasets: [
      {
        label: "Stock Price",
        data: stockData,
        borderColor: "#3a3a3a",
        backgroundColor: "rgba(58, 58, 58, 0.2)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Stock Market Insights</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          className="border p-2 rounded w-1/3"
          placeholder="Enter Stock Symbol (e.g. AAPL)"
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
        />
        <Button onClick={fetchStockData} disabled={loading}>
          {loading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>
      <Card>
        <CardContent>
          <Line data={chartData} />
          {predictedPrice && (
            <p className="text-xl mt-4">Predicted Price: ${predictedPrice.toFixed(2)}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StockInsights;