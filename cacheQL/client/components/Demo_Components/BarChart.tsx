import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables);
Chart.register(CategoryScale);

export default function BarChart({ chartData }) {
  const barData = {
    labels: chartData.map((data) => `Run ${data.id}`),
    datasets: [
      {
        label: "Hit Percentage",
        backgroundColor: "#4682B4",
        data: chartData.map((data) => data.hitPercentage),
        borderColor: "black",
        borderWidth: 1,
        maxBarThickness: 70,
        hoverBorderColor: 'red',
        hoverBackgroundColor: 'green'
      },
      {
        label: "Miss Percentage",
        backgroundColor: "#c0c0c0",
        data: chartData.map((data) => data.missPercentage),
        borderColor: "black",
        borderWidth: 1,
        maxBarThickness: 70,
        hoverBorderColor: 'green',
        hoverBackgroundColor: 'red'
      },
    ],
    
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
              text: "Cache vs. Uncached Response Times",
            },
            tooltip: {
              callbacks: {
                  label: function(context) {
                      let label = context.dataset.label || '';
                      if (context.parsed.y !== null) {
                          label += ' ' +context.parsed.y + '%';
                      }
                      return label;
                  }
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              beginAtZero: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
              ticks: {
                stepSize: 20,
                callback: function (value) {
                  return value + "%";
                }
              }
            },
          },
        }}
      />
    </div>
  );
}
