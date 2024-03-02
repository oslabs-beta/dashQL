import { useState, useEffect } from "react";
import "./styles/Demo.css";
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
  diameter?: number;
};

// people fields
const defaultFields: Fields = {
  name: "",
  mass: "",
  eye_color: "",
  species: "",
  species_name: "",
  classification: "",
};

// planet fields
const defaultPlanet: Fields = {
  name: "",
  diameter: 0,
  terrain: "",
  climate: "",
};

interface dataFormProps {
  changePage: (page: string) => void;
}

export default function Demo({ changePage }: dataFormProps) {
  // updates queryString and currentField (the default fields for what to display)
  const [queryString, setQueryString] = useState<string>("");
  const [currentFields, setField] = useState<Fields>(defaultFields);
  // have state for updating the dropdown. Depending on what dropwdown changes, will change the currentFields state
  const [currentDropdown, setDropdown] = useState<string>("people");
  // states for each checkbox, first being the id box, then the 4 others, and nested checkboxes. This is needed in order to be able to update the displayed queries and query strings as the user is messing around with fields
  const [idBox, updateIdBox] = useState<boolean>(true);
  const [checkboxes, updateCheckboxes] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);
  const [nestedCheckboxes, updateNestedCheckboxes] = useState<boolean[]>([
    false,
    false,
  ]);
  //  if idBox is checked, this updates current id selected
  const [selectedId, setSelectedId] = useState<string>("1");
  // data recieved from backend, queryData is data used when displaying results, and displayResults is a boolean to determine if they should be displayed or not based on if user is changing fields
  const [queryData, setQueryData] = useState<any>({});
  const [displayResults, setDisplayResults] = useState<boolean>(false);
  // chartData and cacheHits are the data stored from backend for the charts
  const [chartData, setChartData] = useState<any>([]);
  const [hitsWithTotal, setHitsWithTotal] = useState<number[]>([0, 0]);
  const [newPage, setNewPage] = useState<boolean>(true);
  const [keys, setKeys] = useState<string[]>([]);

  // set current page to Demo for Nav Bar visibility

  if (newPage) {
    setNewPage(false);
    clearCache();
    setTimeout(() => {
      changePage("Demo");
    }, 50);
    const fieldKeys: string[] = Object.keys(currentFields);
    setKeys(fieldKeys);
  }

  async function queryResult() {
    // function is called when "run query" button clicked. This will send of the query string, and alert the user (for now) if they haven't included the id and another checkbox

    if (!checkboxes[0] && !checkboxes[1] && !checkboxes[2] && !checkboxes[3]) {
      alert("Please select at least one attribute");
      return;
    }
    if (
      checkboxes[3] &&
      !nestedCheckboxes[0] &&
      !nestedCheckboxes[1] &&
      currentFields === defaultFields
    ) {
      alert("Please select at least one attribute from species");
      return;
    }
    // must send in object with query property due to how backend uses the request
    const result = await getData({ query: queryString });
    // get data from backend, update
    setQueryData(result);
    addData(result);
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
  }, [idBox, checkboxes, nestedCheckboxes, selectedId, currentDropdown]);

  // current checkboxes to be used for making the query string and query boxes

  async function updateQueryString() {
    // logic for creating the "GraphQL Query" display box of dashboard, as well as updating the string to be sent to backend, only invokes when useEffect triggered by change
    const firstBox: string = checkboxes[0] ? `${keys[0]}` : "";
    const secondBox: string = checkboxes[1] ? `${keys[1]}` : "";
    const thirdBox: string = checkboxes[2] ? `${keys[2]}` : "";
    let fourthBox: string;
    if (checkboxes[3] && currentFields === defaultFields) {
      fourthBox = `${keys[3]} {`;
    } else if (checkboxes[3] && currentFields !== defaultFields) {
      fourthBox = `${keys[3]}`;
    } else {
      fourthBox = "";
    }
    const firstNestedBox: string =
      nestedCheckboxes[0] && checkboxes[3] ? "name" : "";
    const secondNestedBox: string =
      nestedCheckboxes[1] && checkboxes[3] ? `${keys[5]}` : "";
    const idWanted: string = idBox ? `(_id:${selectedId})` : "";
    const end: string | null =
      !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;
    const nestedEnd: string = firstNestedBox || secondNestedBox ? "}" : "";
    const dropdown: string = idBox ? currentDropdown : `${currentDropdown}NoId`;
    const result: string = `query {${dropdown} ${idWanted}{${firstBox}, ${secondBox}, ${thirdBox}, ${fourthBox} ${firstNestedBox}, ${secondNestedBox} ${nestedEnd} ${end}}`;
    setQueryString(result);
  }

  function changeIdBox() {
    updateIdBox(!idBox);
    updateCheckboxes([false, false, false, false]);
    updateNestedCheckboxes([false, false]);
    setDisplayResults(false);
  }

  function changeDropdown(event: any) {
    // invokes when user changes dropdown value
    if (event.target.value === "people") {
      setField(defaultFields);
      setKeys(Object.keys(defaultFields));
    } else if (event.target.value === "planets") {
      setField(defaultPlanet);
      setKeys(Object.keys(defaultPlanet));
    }
    setDropdown(event.target.value);
    setSelectedId("1");
    setDisplayResults(false);
    updateCheckboxes([false, false, false, false]);
    updateNestedCheckboxes([false, false]);
  }

  function updateCheckboxesFunc(index: any) {
    const currCheckboxes: boolean[] = [...checkboxes];
    currCheckboxes[index] = !checkboxes[index];
    updateCheckboxes(currCheckboxes);
  }

  function updateNestedCheckboxesFunc(index: any) {
    const currNestedCheckboxes: boolean[] = [...nestedCheckboxes];
    currNestedCheckboxes[index] = !nestedCheckboxes[index];
    updateNestedCheckboxes(currNestedCheckboxes);
  }

  function updateBoxFour() {
    const currCheckboxes: boolean[] = [...checkboxes];
    currCheckboxes[3] = !checkboxes[3];
    updateCheckboxes(currCheckboxes);
    if (!checkboxes[3]) {
      updateNestedCheckboxes([false, false]);
    }
    setDisplayResults(false);
  }

  function changeId(event: any) {
    // invokes when user changes id value
    updateCheckboxes([false, false, false, false]);
    updateNestedCheckboxes([false, false]);
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
    updateCheckboxes([false, false, false, false]);
    updateNestedCheckboxes([false, false]);
    setQueryData("");
    setSelectedId("1");
    setDisplayResults(false);
    setChartData([]);
    setHitsWithTotal([0, 0]);
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
            <label id="idBox">
              <input
                type="checkbox"
                checked={idBox}
                onChange={() => changeIdBox()}
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
                checked={checkboxes[0]}
                onChange={() => updateCheckboxesFunc(0)}
              />
              {keys[0]}
            </label>
            {idBox ? (
              <label>
                <input
                  type="checkbox"
                  checked={checkboxes[1]}
                  onChange={() => updateCheckboxesFunc(1)}
                />
                {keys[1]}
              </label>
            ) : null}
            {idBox ? (
              <label>
                <input
                  type="checkbox"
                  checked={checkboxes[2]}
                  onChange={() => updateCheckboxesFunc(2)}
                />
                {keys[2]}
              </label>
            ) : null}
            {idBox ? (
              <label>
                <input
                  type="checkbox"
                  checked={checkboxes[3]}
                  onChange={() => updateBoxFour()}
                />
                {keys[3]}
              </label>
            ) : null}
            {idBox && checkboxes[3] && currentFields === defaultFields ? (
              <label id="nested-checkbox">
                <input
                  type="checkbox"
                  checked={nestedCheckboxes[0]}
                  onChange={() => updateNestedCheckboxesFunc(0)}
                />
                name
              </label>
            ) : null}
            {idBox && checkboxes[3] && currentFields === defaultFields ? (
              <label id="nested-checkbox">
                <input
                  type="checkbox"
                  checked={nestedCheckboxes[1]}
                  onChange={() => updateNestedCheckboxesFunc(1)}
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
              checkboxes={checkboxes}
              nestedCheckboxes={nestedCheckboxes}
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
                checkboxes={checkboxes}
                nestedCheckboxes={nestedCheckboxes}
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
