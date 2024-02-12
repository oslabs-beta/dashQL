import React from "react";
import { Line } from "react-chartjs-2";


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


  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Response Time Graph</h2>
      <Line
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: ""
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
