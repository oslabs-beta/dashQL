import React from "react";
import { Pie } from "react-chartjs-2";

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
