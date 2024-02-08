import { React, useState } from "react";
import "../App.css";
import getData from "../api/apiFetch";

export default function Demo() {
  const [queryString, setQuery] = useState("query{people(_id:1){name, mass}}");
  const [resultQuery, setResult] = useState(""); 

  async function queryResult() {
    const result = await getData({ query: queryString })
    console.log(result)
    setResult(JSON.stringify(result))
  }
  
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
          <input type="checkbox"/>
          <button onClick={() => queryResult()}>
            Run Query
          </button>
          
          <button onClick={() => setResult("")}>
            Clear Cache
          </button>
        </div>
        <div id="query">{queryString}</div>
        <div id="query-results">{resultQuery}
        {/* <div id="clear-cache">
        <button onClick={() => setResult("")}>
            Clear Cache
          </button>
          </div> */}
          </div>
      </section>
    </div>
  );
}
