import { React, useState, useEffect } from "react";
import "../App.css";
import getData from "../api/apiFetch";
import QueryResult from "../api/QueryResult";
import QueryCode from "./queryCode";
import "@fontsource-variable/source-code-pro";
import { Chart } from "chart.js";
// import { listItemTextClasses } from "@mui/material";
import { Data } from "../api/Data";
import { CategoryScale } from "chart.js";
import PieChart from "../api/PieChart";
import {ArcElement} from 'chart.js'
import BarChart from "../api/BarChart"; 
import LineChart from "../api/LineChart"; 
Chart.register(ArcElement);



type Fields = {
  name: string;
  mass?: string;
  population?: number;
};

const defaultFields: Fields = {
  name: "",
  mass: "",
};

const defaultPlanet: Fields = {
  name: "",
  population: 0,
};

export default function Demo() {
  Chart.register(CategoryScale);
  const [querySend, setSend] = useState("");
  const [currentFields, setField] = useState(defaultFields);
  const [currentDropdown, setDropdown] = useState("people");
  const [checkbox1, updateCheckbox1] = useState(true);
  const [checkbox2, updateCheckbox2] = useState(true);
  const [data, setData] = useState(undefined);
  const [id, setId] = useState("Choose ID");
  const [resultId, setResultId] = useState("");
  const [fetchData, setFetch] = useState(false);
  const [chartData, setChartData] = useState({
    labels: Data.map((data) => data.year), 
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.hits),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

  async function queryResult() {
    console.log("sending query string:", querySend);
    if (!checkbox1 && !checkbox2) {
      alert("Please select at least one checkbox");
      return;
    }
    const result = await getData({ query: querySend });
    setData(result);
    setResultId(id);
    setFetch(true);
  }

  useEffect(() => {
    setQueryString();
    setFetch(false);
  }, [checkbox1, checkbox2, id, currentDropdown]);

  const keys: string[] = [];
  Object.keys(currentFields).forEach((key) => {
    keys.push(key);
  });

  async function setQueryString() {
    const firstBox = checkbox1 ? `${keys[0]}` : "";
    const secondBox = checkbox2 ? `${keys[1]}` : "";
    const end = !firstBox && !secondBox ? null : `}`;
    const result = `query {${currentDropdown} ${id !== "Choose ID" ? `(_id:${id})`:""}{${firstBox}, ${secondBox} ${end}}`;
    setSend(result);
  }

  function changeDropdown(event: any) {
    if (event.target.value === "people") {
      setField(defaultFields);
    } else if (event.target.value === "planets") {
      setField(defaultPlanet);
    }
    setDropdown(event.target.value);
  }

  function changeId(event: any) {
    setId(event.target.value);
  }

  function resetAll() {
    setSend("");
    setResultId("1");
    setId("1");
    setField(defaultFields);
    setDropdown("people");
    updateCheckbox1(true);
    updateCheckbox2(true);
    setData(undefined);
  }

  return (
    <div className="demo">
      <h1 id="title">Cache Demo</h1>
      <section className="stats">
        <div id="left-stats">
          <div id="response-graph">Response Graph</div>
          <div id="cache-stats">Cache Stats</div>
        </div>
        <div id="right-stats">
          <div id="cache-times">Cache and Uncached times</div>
          <div id="pie-chart"><PieChart chartData={chartData} /></div>
        </div>
      </section>
      <section className="input">
        <div id="countriesAPI">
          <h1>Star Wars API</h1>
          <p>Select the fields to query:</p>
          <select
            name="select"
            value={currentDropdown}
            onChange={(e) => changeDropdown(e)}
          >
            <option value={"people"}>People</option>
            <option value={"planets"}>Planets</option>
          </select>
          <select name="select" value={id !== "Choose ID" ? id : "Choose ID"} onChange={(e) => changeId(e)}>
            <option value={"1"}>1</option>
            <option value={"2"}>2</option>
            <option value={"3"}>3</option>
            <option value={"4"}>4</option>
            <option value={"5"}>5</option>
          </select>
          <label>
            <input
              type="checkbox"
              checked={checkbox1}
              onChange={() => updateCheckbox1(!checkbox1)}
            />
            {keys[0]}
          </label>
          <label>
            <input
              type="checkbox"
              checked={checkbox2}
              onChange={() => updateCheckbox2(!checkbox2)}
            />
            {keys[1]}
          </label>
          <div className="buttons">
            <button onClick={() => queryResult()}>Run Query</button>
            <button onClick={() => resetAll()}>Clear Cache</button>
          </div>
        </div>
        <div id="graphql-query-container">
          <h3>GraphQL Query</h3>
          <div id="query">
            <QueryCode
              checkbox1={checkbox1}
              checkbox2={checkbox2}
              keys={keys}
              currentDropdown={currentDropdown}
              id={id}
            />
          </div>
        </div>
        <div id="response-query-container">
          <h3>Query Results</h3>
          <div id="query-results">
            {fetchData ? (
              <QueryResult
                checkbox1={checkbox1}
                checkbox2={checkbox2}
                keys={keys}
                currentDropdown={currentDropdown}
                data={data}
                id={resultId}
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
