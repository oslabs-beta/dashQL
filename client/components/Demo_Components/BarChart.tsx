import { Bar } from "react-chartjs-2";
import { Chart, registerables, CategoryScale, ArcElement } from "chart.js";
Chart.register(ArcElement);
Chart.register(...registerables);
Chart.register(CategoryScale);

export default function BarChart({ chartData }: any) {
  const barData = {
    labels: chartData.map((data: any) => `Run ${data.id}`),
    datasets: [
      {
        label: "Hit Percentage",
        backgroundColor: "#4682B4",
        data: chartData.map((data: any) => data.hitPercentage),
        borderColor: "black",
        borderWidth: 1,
        maxBarThickness: 70,
        hoverBackgroundColor: "lightgreen",
      },
      {
        label: "Miss Percentage",
        backgroundColor: "#c0c0c0",
        data: chartData.map((data: any) => data.missPercentage),
        borderColor: "black",
        borderWidth: 1,
        maxBarThickness: 70,
        hoverBackgroundColor: "#FF7F7F",
      },
    ],
  };

  return (
    <div className="chart-container">
      <h3 id="bar-chart-header" style={{ textAlign: "center" }}>
        Stacked Bar Chart
      </h3>
      <Bar
        id="bar"
        data={barData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Cache vs. Uncached Response Times",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  let label = context.dataset.label || "";
                  if (context.parsed.y !== null) {
                    label += ": " + Math.round(context.parsed.y) + "%";
                  }
                  return label;
                },
              },
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
              beginAtZero: true,
              min: 0,
              max: 100,
              ticks: {
                stepSize: 20,
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
