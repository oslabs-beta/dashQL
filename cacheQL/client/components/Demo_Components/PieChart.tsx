import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables)
Chart.register(CategoryScale);



export default function PieChart({chartData, cacheHits}){
  const hitPercentage = cacheHits !== 0 ? cacheHits/chartData.length * 100 : 0
  const pieData = {
    // labels: Data.map((data) => data.id), 
    labels: ['Hit', 'Miss'],
    datasets: [
      {
        label: "Cache Hit Rate",
        data: [hitPercentage, 100 - hitPercentage ],
        backgroundColor: [
          "#4682B4",
          "#c0c0c0 ",
          // "rgba(75,192,192,1)",
          // "#ecf0f1",
        ], 
        hoverOffset: 4, 
        rotation: -90,
        borderColor: "black",
        aspectRatio: 0, 
        borderWidth: 1,
      },
    ]
  };




  
  return (
    <div className="chart-contrainer">
      {/* <h2 style={{ textAlign: "center" }}>Hit/Miss Rate Chart</h2> */}
      <Pie width={"200px"} height={"200px"} 
        data={pieData}
        options={{
          plugins: {
            title: {
              display: true, 
              text: "Cache Hit/Miss Rate Chart"
            },
            legend: {
              display: true,
              position: 'bottom'
            }
          }
        }}
      />
    </div>
  );
}
