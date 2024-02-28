import { React, useState, useEffect, useLayoutEffect } from "react";
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
  species?: string;
  eye_color?: string;
  terrain?: string;
  climate?: string;
  species_name?: string;
  classification?: string;
  diameter?: number
};

// people fields
const defaultFields: Fields = {
  name: "",
  mass: "",
  eye_color: "",
  species: "",
  species_name: "",
  classification: ""
};

// planet fields
const defaultPlanet: Fields = {
  name: "",
  diameter: 0,
  terrain: "",
  climate: "",
};

interface dataFormProps {
  changePage: () => void;
}

export default function Demo({ changePage }: dataFormProps) {
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
  const [nestedFirstBox, updateNestedFirstBox] = useState(false)
  const [nestedSecondBox, updateNestedSecondBox] = useState(false)
  //  if idBox is checked, this updates current id selected
  const [selectedId, setSelectedId] = useState("1");
  // data recieved from backend, queryData is data used when displaying results, and displayResults is a boolean to determine if they should be displayed or not based on if user is changing fields
  const [queryData, setQueryData] = useState({});
  const [displayResults, setDisplayResults] = useState(false);
  // chartData and cacheHits are the data stored from backend for the charts
  const [chartData, setChartData] = useState([]);
  const [cacheHits, setCacheHits] = useState(0);
  const [hitsWithTotal, setHitsWithTotal] = useState([0, 0]);
  const [newPage, setNewPage] = useState(true);

  useLayoutEffect(() => {
    changePage("Demo");
  });

  if (newPage) {
    setNewPage(false);
    clearCache();
  }

  async function queryResult() {
    // function is called when "run query" button clicked. This will send of the query string, and alert the user (for now) if they haven't included the id and another checkbox

    if (!checkbox1 && !checkbox2 && !checkbox3 && !checkbox4) {
      alert("Please select at least one attribute");
      return;
    }
    if (checkbox4 && !nestedFirstBox && !nestedSecondBox && currentFields === defaultFields ) {
      alert("Please select at least one attribute from species");
      return;
    }
    console.log('query string',queryString);
    // must send in object with query property due to how backend uses the request
    const result = await getData({ query: queryString });
    // get data from backend, update
    setQueryData(result);
    addData(result);
    result.cacheHit ? setCacheHits(cacheHits + 1) : null;
    setDisplayResults(true);
  }

  function addData(result: any) {
    // this function adds data to chartData after each query is ran
    const len: number = chartData.length + 1;
    type Data = {
      id: number;
      cacheHit: boolean;
      response_time: number;
      hitPercentage: number;
      missPercentage: number;
    };

    const newData: Data = {
      id: len,
      cacheHit: result.cacheHit,
      response_time: result.time,
      hitPercentage: result.hitPercentage * 100,
      missPercentage: result.missPercentage * 100,
    };
    setHitsWithTotal([
      hitsWithTotal[0] + result.totalHits,
      hitsWithTotal[1] + result.totalQueries,
    ]);
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
    nestedFirstBox,
    nestedSecondBox,
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
    let fourthBox: string; 
    if (checkbox4 && currentFields === defaultFields){
      fourthBox = `${keys[3]} {`
    } else if (checkbox4 && currentFields !== defaultFields){
      fourthBox = `${keys[3]}`
    } else {
      fourthBox = ""
    }
    const firstNestedBox: string = nestedFirstBox ? "name" : "";
    const secondNestedBox: string = nestedSecondBox ? `${keys[5]}` : "";
    const idWanted: string = idBox ? `(_id:${selectedId})` : "";
    const end: string | null =
      !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;
    const nestedEnd = firstNestedBox || secondNestedBox ? '}' : ""
    const dropdown = idBox ? currentDropdown : `${currentDropdown}NoId`;
    const result: string = `query {${dropdown} ${idWanted}{${firstBox}, ${secondBox}, ${thirdBox}, ${fourthBox} ${firstNestedBox}, ${secondNestedBox} ${nestedEnd} ${end}}`;
    setQueryString(result);
    console.log(queryString)
  }

  function changeIdBox() {
    updateIdBox(!idBox);
    updateCheckbox1(false);
    updateCheckbox2(false);
    updateCheckbox3(false);
    updateCheckbox4(false);
    updateNestedFirstBox(false)
    updateNestedSecondBox(false)
    setDisplayResults(false);
  }

  function changeDropdown(event: any) {
    // invokes when user changes dropdown value
    if (event.target.value === "people") {
      setField(defaultFields);
    } else if (event.target.value === "planets") {
      setField(defaultPlanet);
    }
    setDropdown(event.target.value);
    setDisplayResults(false);
    updateCheckbox1(false);
    updateCheckbox2(false);
    updateCheckbox3(false);
    updateCheckbox4(false);
    updateNestedFirstBox(false)
    updateNestedSecondBox(false)
  }

  function changeId(event: any) {
    // invokes when user changes id value
    updateCheckbox1(false);
    updateCheckbox2(false);
    updateCheckbox3(false);
    updateCheckbox4(false);
    updateNestedFirstBox(false)
    updateNestedSecondBox(false)
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
    alert("Cache cleared");
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
            <ResultCard chartData={chartData} hitsWithTotal={hitsWithTotal} />
          </div>
        </div>
        <div id="right-stats">
          <div id="cache-times">
            <BarChart chartData={chartData} />
          </div>
          <div id="pie-chart">
            <PieChart chartData={chartData} hitsWithTotal={hitsWithTotal} />
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
          <div id="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={idBox}
              onChange={(e) => changeIdBox(e)}
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
                <option value={"6"}>6</option>
                <option value={"7"}>7</option>
                <option value={"8"}>8</option>
                <option value={"9"}>9</option>
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
          {idBox ? (
            <label>
              <input
                type="checkbox"
                checked={checkbox2}
                onChange={() => updateCheckbox2(!checkbox2)}
              />
              {keys[1]}
            </label>
          ) : null}
          {idBox ? (
            <label>
              <input
                type="checkbox"
                checked={checkbox3}
                onChange={() => updateCheckbox3(!checkbox3)}
              />
              {keys[2]}
            </label>
          ) : null}
          {idBox ? (
            <label>
              <input
                type="checkbox"
                checked={checkbox4}
                onChange={() => updateCheckbox4(!checkbox4)}
              />
              {keys[3]}
            </label>
          ) : null}
          {idBox && checkbox4 && currentFields === defaultFields ? (
            <label id="nested-checkbox">
              <input
                type="checkbox"
                checked={nestedFirstBox}
                onChange={() => updateNestedFirstBox(!nestedFirstBox)}
              />
              name
            </label>
          ) : null}
          {idBox && checkbox4 && currentFields === defaultFields ? (
            <label id="nested-checkbox">
              <input
                type="checkbox"
                checked={nestedSecondBox}
                onChange={() => updateNestedSecondBox(!nestedSecondBox)}
              />
              {keys[5]}
            </label>
          ) : null}
          </div>
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
              nestedBox = {nestedFirstBox}
              nestedBox2 = {nestedSecondBox}
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
                nestedBox = {nestedFirstBox}
                nestedBox2 = {nestedSecondBox}
                keys={keys}
                dataField={idBox ? currentDropdown : currentDropdown + "NoId"}
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
