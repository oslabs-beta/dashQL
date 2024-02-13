import {React, useState} from "react";
import { Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables)
Chart.register(CategoryScale);



<<<<<<< HEAD
=======

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


>>>>>>> a61335949e36b31e57e9facccd9b049105319a4e
function LineChart({ chartData }) {
  
  const lineData = {
    labels: chartData.map((data) => chartData.length !==1 ? `Run ${data.id}` : ''),
    datasets: [
      {
        label: "Cached Response Time",
        data: chartData.map((data) => data.response_time),
        backgroundColor: ["rgba(75,192,192,1)", "#ecf0f1"],
        borderColor: "black",
        borderWidth: 2,
      },
    ],
  }
<<<<<<< HEAD
=======

>>>>>>> a61335949e36b31e57e9facccd9b049105319a4e

  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Response Time Graph</h2>
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
