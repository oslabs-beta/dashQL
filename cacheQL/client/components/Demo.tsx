import { React, useState, useEffect } from "react";
import "../App.css";
import getData from "../api/apiFetch";
import QueryResult from "./Demo_Components/QueryResult";
import QueryCode from "./Demo_Components/queryCode";
import "@fontsource-variable/source-code-pro";
import BarChart from "./Demo_Components/BarChart";
import PieChart from "./Demo_Components/PieChart";
import LineChart from "./Demo_Components/LineChart";
import ResultCard from "./Demo_Components/ResultCard";
import clearCache from "../api/clearCache";

// for which api part is selected by user (people, planets etc)
type Fields = {
  name: string;
  mass?: string;
  population?: number;
  hair_color?: string;
  eye_color?: string;
};

// people fields
const defaultFields: Fields = {
  name: "",
  mass: "",
  eye_color: "",
  hair_color: "",
};

// planet fields
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
  //  if idBox is checked, this updates current id selected
  const [selectedId, setSelectedId] = useState("1");
  // data recieved from backend, queryData is data used when displaying results, and displayResults is a boolean to determine if they should be displayed or not based on if user is changing fields
  const [queryData, setQueryData] = useState({});
  const [displayResults, setDisplayResults] = useState(false);
  // chartData and cacheHits are the data stored from backend for the charts
  const [chartData, setChartData] = useState([]);
  const [cacheHits, setCacheHits] = useState(0);

  async function queryResult() {
    // function is called when "run query" button clicked. This will send of the query string, and alert the user (for now) if they haven't included the id and another checkbox

    if ((!checkbox1 && !checkbox2 && !checkbox3 && !checkbox4) || !idBox) {
      alert("Please select ID (at the moment) and one other checkbox");
      return;
    }
    // must send in object with query property due to how backend uses the request
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
    const len: number = chartData.length + 1;
    type Data = {
      id: number;
      response_time: number;
    };

    const newData: Data = {
      id: len,
      response_time: result,
    };

    setChartData([...chartData, newData]);
  }

  useEffect(() => {
    // when any checkbox is clicked or dropdown selection edits, will set fetch to false to empty "QUERY RESULTS" part of the dashboard, and will update the query string in order to update the "GraphQL Query" part of dashboard
    setDisplayResults(false);
    updateQueryString();
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
  const keys: string[] = Object.keys(currentFields);

  async function updateQueryString() {
    // logic for creating the "GraphQL Query" display box of dashboard, as well as updating the string to be sent to backend, only invokes when useEffect triggered by change
    const firstBox: string = checkbox1 ? `${keys[0]}` : "";
    const secondBox: string = checkbox2 ? `${keys[1]}` : "";
    const thirdBox: string = checkbox3 ? `${keys[2]}` : "";
    const fourthBox: string = checkbox4 ? `${keys[3]}` : "";
    const idWanted: string = idBox ? `(_id:${selectedId})` : "";
    const end: string | null =
      !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;
    const result: string = `query {${currentDropdown} ${idWanted}{${firstBox}, ${secondBox}, ${thirdBox}, ${fourthBox} ${end}}`;
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
    setQueryData("");
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
            <ResultCard chartData={chartData} cacheHits={cacheHits} />
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
      <section className="input-container">
        <div id="query-fields">
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
                name="id selection"
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
