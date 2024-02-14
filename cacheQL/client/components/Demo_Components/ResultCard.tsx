import {React} from "react";

type ResultTypes = {
  chartData: any,
  cacheHits: number
};

export default function ResultCard({ chartData, cacheHits }: ResultTypes) {
  return (
    <div id="cache-card">
      <h4>Result Details</h4>
      <p>
        Response Time:{" "}
        {chartData.length > 0
          ? `${Math.round(chartData[chartData.length - 1]["response_time"])} ms`
          : null}
      </p>
      <p>Cache Hits: {chartData.length > 0 ? cacheHits : null}</p>
      <p>
        Cache Misses:{" "}
        {chartData.length > 0 ? chartData.length - cacheHits : null}
      </p>
      <p>
        Hit Rate:{" "}
        {chartData.length > 0
          ? `${Math.round((cacheHits / chartData.length) * 100)}%`
          : null}
      </p>
    </div>
  );
}
