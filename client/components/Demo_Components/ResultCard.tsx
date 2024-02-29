
type ResultTypes = {
  chartData: any,
  hitPercentage?: number
  hitsWithTotal: number[];
};

export default function ResultCard({ chartData, hitsWithTotal }: ResultTypes) {
  return (
    <div id="cache-card">
      <h4>Result Details</h4>
      <p>
        Response Time:{" "}
        {chartData.length > 0
          ? `${Math.round(chartData[chartData.length - 1]["response_time"])} ms`
          : null}
      </p>
      <p>Hit Percentage: {chartData.length > 0 ? `${Math.round(chartData[chartData.length-1]["hitPercentage"])}%` : null}</p>
      <p>
        Miss Percentage:{" "}
        {chartData.length > 0 ? `${Math.round(chartData[chartData.length-1]["missPercentage"])}%` : null}
      </p>
      <p>
        Aggregated Field Hit Rate:{" "}
        {chartData.length > 0
          ? `${Math.round((hitsWithTotal[0] / hitsWithTotal[1]) * 100)}%`
          : null}
      </p>
    </div>
  );
}
