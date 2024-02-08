import { React, useState } from "react";
import "../App.css";



export default function Demo() {
    const [queryString, setQuery] = useState(
      "query{people(_id:1){name, mass}}"
    );

    const getData = async function (queryStr: string) {
      console.log("------in fetch---------");

      const response = await fetch("http://localhost:5001/api/query", {
        method: "POST",
        body: queryStr,
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        console.log("Error");
      }

      const data = await response.json();
      console.log(data);
    };

  return (
    <div className="demo">
      <h1 id="title">Cache Demo</h1>
      <section className="stats">
        <div id="left-stats">
          <div id="response-graph">Response graph</div>
          <div id="cache-stats">Cache Stats</div>
        </div>
        <div id="right-stats">
          <div id="cache-times">Cache and Uncached times</div>
          <div id="pie-chart">Pie chart</div>
        </div>
      </section>
      <section className="input">
        <div id="countriesAPI">
          <h1>Countries API</h1>
          <p>Select the fields to query:</p>
          <button onClick={() => getData(queryString)}>Run Query</button>
        </div>
        <div id="query">GraphQL Query</div>
        <div id="query-results">Query Results</div>
      </section>
    </div>
  );
}
