import { React, useState, useEffect } from "react";
import "../App.css";
import getData from "../api/apiFetch";
import QueryResult from "../api/QueryResult";
import QueryCode from "./QueryCode";
import "@fontsource-variable/source-code-pro";
import BarChart from "../api/BarChart";
import PieChart from "../api/PieChart";
import LineChart from "../api/LineChart";
import clearCache from "../api/clearCache";

type Fields = {
  name: string;
  mass?: string;
  population?: number;
  hair_color?: string;
  eye_color?: string;
};

const defaultFields: Fields = {
  name: "",
  mass: "",
  eye_color: "",
  hair_color: "",
};

const defaultPlanet: Fields = {
  name: "",
  population: 0,
};

export default function Demo() {
  // updates queryString and currentField (the default fields for what to display)
  const [queryString, setQueryString] = useState("");
  const [currentFields, setField] = useState(defaultFields);
  // have state for updating the dropdown. Depending on what dropwdown changes, will change the currentFields state
  const [currentDropdown, setDropdown] = useState("people");
  // states for each checkbox, first being the id box, then the 4 others. This is needed in order to be able to update the displayed queries and query strings as the user is messing around with fields
  const [idBox, updateIdBox] = useState(true);
  const [checkbox1, updateCheckbox1] = useState(false);
  const [checkbox2, updateCheckbox2] = useState(false);
  const [checkbox3, updateCheckbox3] = useState(false);
  const [checkbox4, updateCheckbox4] = useState(false);
  // for if idBox is checked, this updates current id selected
  const [selectedId, setSelectedId] = useState("1");
  // data recieved from backend, queryData is used to display results, and displayResults is a boolean to determine if they should be displayed or not based on if user is changing fields
  const [queryData, setQueryData] = useState({});
  const [displayResults, setDisplayResults] = useState(false);
  // chartData and cacheHits are the data stored from backend for the charts
  const [chartData, setChartData] = useState([]);
  const [cacheHits, setCacheHits] = useState(0);

  async function queryResult() {
    // function is called when "run query" button clicked. This will send of the query string, and alert the user (for now) if they haven't included the id and another checkbox
    console.log("sending query string:", queryString);
    if ((!checkbox1 && !checkbox2 && !checkbox3 && !checkbox4) || !idBox) {
      alert("Please select ID (at the moment) and one other checkbox");
      return;
    }
    const result = await getData({ query: queryString });
    // get data from backend, update
    setQueryData(result);
    addData(result.time);
    result.cacheHit ? setCacheHits(cacheHits + 1) : null;
    // setResultId(selectedId);
    setDisplayResults(true);
  }

  function addData(result: number) {
    // this function adds data to chartData after each query is ran
    const len = chartData.length + 1;
    const newData = {
      id: len,
      response_time: result,
    };
    setChartData([...chartData, newData]);
  }

  useEffect(() => {
    // when any checkbox is clicked or dropdown selection edits, will set fetch to false to empty "QUERY RESULTS" part of the dashboard, and will update the query string in order to update the "GraphQL Query" part of dashboard
    updateQueryString();
    setDisplayResults(false);
  }, [
    idBox,
    checkbox1,
    checkbox2,
    checkbox3,
    checkbox4,
    selectedId,
    currentDropdown,
  ]);

  // current checkboxes to be used for making the query string and query boxes
  const keys = Object.keys(currentFields);

  async function updateQueryString() {
    // logic for creating the "GraphQL Query" display box of dashboard, as well as updating the string to be sent to backend, only invokes when useEffect triggered by change
    const firstBox = checkbox1 ? `${keys[0]}` : "";
    const secondBox = checkbox2 ? `${keys[1]}` : "";
    const thirdBox = checkbox3 ? `${keys[2]}` : "";
    const fourthBox = checkbox4 ? `${keys[3]}` : "";
    const idWanted = idBox ? `(_id:${selectedId})` : "";
    const end = !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;
    const result = `query {${currentDropdown} ${idWanted}{${firstBox}, ${secondBox}, ${thirdBox}, ${fourthBox} ${end}}`;
    setQueryString(result);
  }

  function changeDropdown(event: any) {
    // invokes when user changes dropdown value
    if (event.target.value === "people") {
      setField(defaultFields);
    } else if (event.target.value === "planets") {
      setField(defaultPlanet);
    }
    setDropdown(event.target.value);
  }

  function changeId(event: any) {
    // invokes when user changes id value
    setSelectedId(event.target.value);
  }

  // invoked when clear cache button is clicked
  function resetAll() {
    // clear backend cache
    clearCache();
    // resets all states
    setQueryString("");
    setField(defaultFields);
    setDropdown("people");
    updateCheckbox1(false);
    updateCheckbox2(false);
    updateCheckbox3(false);
    updateCheckbox4(false);
    setQueryData(undefined);
    setSelectedId("1");
    setDisplayResults(false);
    setChartData([]);
    setCacheHits(0);
  }

  return (
    <div className="demo">
      <h1 id="title">dashQL Cache Demo</h1>
      <section className="stats">
        <div id="left-stats">
          <div id="response-graph">
            <LineChart chartData={chartData} />
          </div>
          <div id="cache-stats">
            <div id="cache-card">
              <h4>Result Details</h4>
              <p>
                Response time:{" "}
                {chartData.length > 0
                  ? `${Math.round(
                      chartData[chartData.length - 1]["response_time"]
                    )} ms`
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
          </div>
        </div>
        <div id="right-stats">
          <div id="cache-times">
            <BarChart chartData={chartData} />
          </div>
          <div id="pie-chart">
            <PieChart chartData={chartData} cacheHits={cacheHits} />
          </div>
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
          <label>
            <input
              type="checkbox"
              checked={idBox}
              onChange={() => updateIdBox(!idBox)}
            />
            _id
          </label>
          <div>
            {idBox ? (
              // only show id dropdown if id box is checked
              // can have a way to populate this field with more id's based on query selection
              <select
                name="select"
                value={selectedId}
                onChange={(e) => changeId(e)}
              >
                <option value={"1"}>1</option>
                <option value={"2"}>2</option>
                <option value={"3"}>3</option>
                <option value={"4"}>4</option>
                <option value={"5"}>5</option>
              </select>
            ) : null}
          </div>
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

          <label>
            <input
              type="checkbox"
              checked={checkbox3}
              onChange={() => updateCheckbox3(!checkbox3)}
            />
            {keys[2]}
          </label>
          <label>
            <input
              type="checkbox"
              checked={checkbox4}
              onChange={() => updateCheckbox4(!checkbox4)}
            />
            {keys[3]}
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
              checkbox3={checkbox3}
              checkbox4={checkbox4}
              keys={keys}
              currentDropdown={currentDropdown}
              id={idBox ? selectedId : undefined}
            />
          </div>
        </div>
        <div id="response-query-container">
          <h3>Query Results</h3>
          <div id="query-results">
            {/*  */}
            {displayResults ? (
              <QueryResult
                checkbox1={checkbox1}
                checkbox2={checkbox2}
                checkbox3={checkbox3}
                checkbox4={checkbox4}
                keys={keys}
                currentDropdown={currentDropdown}
                data={queryData}
                id={idBox ? selectedId : undefined}
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
