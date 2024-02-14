import {React, useState} from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables)
Chart.register(CategoryScale);




export default function LineChart({ chartData }) {
  // const { responseTime } = useResponseTime();
  // let count = 0;
  // const totalCache = responseTime.length - 1;
  // responseTime.forEach((obj) => {
  //   if (obj.cached === 'Cached') {
  //     count++;
  //   }
  // });
  // const cacheMiss = totalCache - count;
  // const hitRate = Math.floor((count / totalCache) * 100);
  
  const lineData = {
    labels: chartData.map((data) => chartData.length !==0 ? `Run ${data.id}` : ''),
    datasets: [
      {
        label: "Cached Response Time",
        data: chartData.map((data) => data.response_time),
        // borderDash: [5,5],
        backgroundColor: ["rgba(75,192,192,1)", "#557373"],
        borderColor: "#557373",
        pointBorderWidth: 2, 
        pointBorderColor: '#4682B4', 
        pointBackgroundColor: '#4682B4', 
        borderWidth: 2,
        tension: 0.1,
        fill: false, 
        drawTicks: true
      },
    ],
  }

  return (
    <div className="chart-container">
      <h3 style={{ textAlign: "center" }}>Response Time Graph</h3>
      <Line
        data={lineData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Response Times"
            },
            legend: {
              display: false
            }
          }
        }}
      />
    </div>
  );
}
