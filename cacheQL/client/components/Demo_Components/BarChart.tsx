import React from 'react'; 
import { Bar } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables)
Chart.register(CategoryScale);


export default function BarChart({ chartData })  {

  const barData = {
    labels: chartData.map((data) => data.id), 
    datasets: [
      {
        label: "Users Gained ",
        data: chartData.map((data) => data.response_time),
        backgroundColor: [
          "#C3B1E1",
          "#021c41",
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  };

  return (
    <div className="chart-container">
      <h3 style={{ textAlign: "center" }}>Bar Chart</h3>
      <Bar 
        data={barData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Cache vs. Uncached Response Times"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
};