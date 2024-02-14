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
        labels: "Cache vs. Uncached",
        data: chartData.map((data) => data.response_time),
        backgroundColor: [
          "#4682B4",
          "#c0c0c0 ",
        ],
        borderColor: "black",
        borderWidth: 1
      },
      // {
      //   labels: "Cache vs. Uncached",
      //   data: chartData.map((data) => data.hitPercentage),
      //   backgroundColor: [
      //     "#4682B4",
      //     "#c0c0c0 ",
      //   ],
      //   borderColor: "black",
      //   borderWidth: 1
      // },

    ],
  };

  return (
    <div className="chart-container">
      <h3 style={{ textAlign: "center" }}>Bar Chart</h3>
      <Bar  
        data={barData}
        options={{
          scales: {
            x: {
              stacked: true
            },
            y: {
              stacked: false,
              beginAtZero: true, 
            }
          },
          plugins: {
            title: {
              display: true,
              text: "Cache vs. Uncached Response Times"
            },
            legend: {
              display: false
            }
          },
          responsive: true
        }}
      />
    </div>
  );
};