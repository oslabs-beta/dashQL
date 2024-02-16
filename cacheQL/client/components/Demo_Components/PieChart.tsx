import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables);
Chart.register(CategoryScale);

type ResultTypes = {
  chartData: any;
  cacheHits?: number;
  hitsWithTotal: number[];
};

export default function PieChart({ chartData, hitsWithTotal }: ResultTypes) {
  const currentPercentage =
    chartData.length !== 0 ? (hitsWithTotal[0] / hitsWithTotal[1]) * 100 : 0;
  const pieData = {
    // labels: Data.map((data) => data.id),
    labels: ["Hit %", "Miss %"],
    datasets: [
      {
        label: "Cache Hit Rate",
        data: [currentPercentage, 100 - currentPercentage],
        backgroundColor: ["#4682B4", "#c0c0c0 "],
        hoverBackgroundColor: ["lightgreen", "#FF7F7F"],
        hoverOffset: 4,
        rotation: -90,
        borderColor: "black",
        aspectRatio: 0,
        borderWidth: 1,
      },
    ],
  };

  Chart.defaults.plugins.tooltip.callbacks.label = function (context) {
    const total = context.dataset.data.reduce((x, y) => x + y, 0);
    const currentValue = context.parsed;
    const percentage = ((currentValue / total) * 100).toFixed(0);
    return `${percentage}%`;
  };
  return (
    <div className="chart-contrainer">
      {/* <h2 style={{ textAlign: "center" }}>Hit/Miss Rate Chart</h2> */}
      <Pie
        width={"200px"}
        height={"200px"}
        data={pieData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Aggregated Field Hit vs. Miss %",
            },
            legend: {
              display: true,
              position: "bottom",
            },
          },
        }}
      />
    </div>
  );
}
