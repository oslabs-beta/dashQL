import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables)
Chart.register(CategoryScale);



export default function PieChart({chartData}){
  // console.log(charData.id); 
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Hit/Miss Rate Chart</h2>
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true
              // text: "Users Gained between 2016-2020"
            }
          }
        }}
      />
    </div>
  );
}
