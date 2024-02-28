import { Line } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables)
Chart.register(CategoryScale);




export default function LineChart({chartData}:any) {
  
  const lineData = {
    labels: chartData.map((data:any) => chartData.length !==0 ? `Run ${data.id}` : ''),
    datasets: [
      {
        label: "Response Time",
        data: chartData.map((data:any) => data.response_time),
        // borderDash: [5,5],
        backgroundColor: ["rgba(75,192,192,1)", "#557373"],
        borderColor: "#557373",
        pointBorderWidth: 1, 
        pointBorderColor: '#4682B4', 
        pointBackgroundColor: '#4682B4', 
        borderWidth: 1,
        drawTicks: true
      },
    ],
  }

  return (
    <div className="chart-container">
      <h3 style={{ textAlign: "center" }} id="bar-chart-header" >Response Time Graph</h3>
      <Line 
        data={lineData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Response Times",
            },
            legend: {
              display: false,
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = `${context.dataset.label}: ` || "";
                  if (context.parsed.y !== null) {
                    label += " " + Math.round(context.parsed.y) + " ms";
                  }
                  return label;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
