import { React, useState, useEffect } from "react";
import "../App.css";
import getData from "../api/apiFetch";
import QueryResult from "../api/QueryResult";
import QueryCode from "./queryCode";
import "@fontsource-variable/source-code-pro";
import { Chart, registerables, CategoryScale } from "chart.js";
// import { listItemTextClasses } from "@mui/material";

import { Data } from "../api/Data";
import PieChart from "../api/PieChart";
import { ArcElement } from "chart.js";
import BarChart from "../api/BarChart";
import LineChart from "../api/LineChart";
Chart.register(ArcElement);
Chart.register(...registerables)
// Chart.register(...controllers);


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
  name: '',
  population: 0,
};

export default function Demo() {
  const [querySend, setSend] = useState('');
  const [currentFields, setField] = useState(defaultFields);
  const [currentDropdown, setDropdown] = useState('people');
  const [checkbox1, updateCheckbox1] = useState(false);
  const [checkbox2, updateCheckbox2] = useState(false);
  const [checkbox3, updateCheckbox3] = useState(true);
  const [checkbox4, updateCheckbox4] = useState(false);
  const [checkbox5, updateCheckbox5] = useState(false);
  const [data, setData] = useState(undefined);
  const [id, setId] = useState('1');
  const [resultId, setResultId] = useState('1');
  const [fetchData, setFetch] = useState(false);
  const [chartData, setChartData] = useState({
    // labels: Data.map((data) => data.id), 
    labels: ['Cache Hit', 'Cache Miss'],
    datasets: [
      {
        label: "Cache Hit Rate ",
        data: [40, 60],
        // data: Data.map((data) => data.hits),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
        ],
        hoverOffset: 4, 
        rotation: -90,
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

  const [lineData, setLineData] = useState({
    labels: Data.map((data) => data.cached), 
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.response_time),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });

//   const [chartData, setChartData] = useState([{}])


  const [barData, setBarData] = useState({
    labels: Data.map((data) => data.id), 
    datasets: [
      {
        label: "Users Gained ",
        data: Data.map((data) => data.response_time),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
        ],
        borderColor: "black",
        borderWidth: 2
      }
    ]
  });
  // function LineChart({ chartData }) {
  
  //   const lineData = {
  //     labels: chartData.map((data) =>  `Run ${data.id}`),
  //     datasets: [
  //       {
  //         label: "Cached Response Time",
  //         data: chartData.map((data) => data.response_time),
  //         backgroundColor: ["rgba(75,192,192,1)", "#ecf0f1"],
  //         borderColor: "black",
  //         borderWidth: 2,
  //       },
  //     ],
  //   }
  async function queryResult() {
    // function is called when "run query" button clicked. This will send of the query string, and alert the user (for now) if they haven't included the id and another checkbox
    console.log('sending query string:', querySend);
    if ((!checkbox1 && !checkbox2) || !checkbox3) {
      alert('Please select ID (at the moment) and one other checkbox');
      return;
    }
    const result = await getData({ query: querySend });
    setData(result);
    setResultId(id);
    setFetch(true);
  }

  useEffect(() => {
    // when any checkbox is clicked or dropdown selection edits, will set fetch to false to empty "QUERY RESULTS" part of the dashboard, and wille dit the query string in order to update the "GraphQL Query" part of dashboard
    setQueryString();
    setFetch(false);
  }, [
    checkbox1,
    checkbox2,
    checkbox3,
    checkbox4,
    checkbox5,
    id,
    currentDropdown,
  ]);

  const keys: string[] = [];
  Object.keys(currentFields).forEach((key) => {
    keys.push(key);
  });

  async function setQueryString() {
    // logic for creating the "GraphQL Query part of dashboard", only invokes when useEffect triggered by change
    const firstBox = checkbox1 ? `${keys[0]}` : "";
    const secondBox = checkbox2 ? `${keys[1]}` : "";
    const thirdBox = checkbox4 ? `${keys[2]}` : "";
    const fourthBox = checkbox5 ? `${keys[3]}` : "";
    const idBox = checkbox3 ? `(_id:${id})` : "";
    const end = !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;
    const result = `query {${currentDropdown} ${idBox}{${firstBox}, ${secondBox}, ${thirdBox}, ${fourthBox} ${end}}`;

    setSend(result);
  }

  function changeDropdown(event: any) {
    if (event.target.value === 'people') {
      setField(defaultFields);
    } else if (event.target.value === 'planets') {
      setField(defaultPlanet);
    }
    setDropdown(event.target.value);
  }

  function changeId(event: any) {
    setId(event.target.value);
  }

  function resetAll() {
    // resets all fields when clear cache clicked
    setSend('');
    setResultId('1');
    setId('1');
    setField(defaultFields);
    setDropdown('people');
    updateCheckbox1(false);
    updateCheckbox2(false);
    updateCheckbox4(false);
    updateCheckbox5(false);
    setData(undefined);
  }

  return (
    <div className="demo">
      <h1 id="title">Cache Demo</h1>
      <section className="stats">
        <div id="left-stats">
          <div id="line-chart"><LineChart chartData={lineData} /></div>
          <div id="cache-stats">Cache Stats</div>
        </div>

        <div id="right-stats">
          <div id="bar-chart"><BarChart chartData={barData} /></div>
          <div id="pie-chart"><PieChart chartData={chartData} /></div>
          <div id="cache-times">Cache and Uncached times</div>
          <div id="pie-chart">
            {/* <PieChart chartData={chartData} /> */}
          </div>
        </div>
      </section>
      <section className='input'>
        <div id='countriesAPI'>
          <h1>Star Wars API</h1>
          <p>Select the fields to query:</p>
          <select
            name='select'
            value={currentDropdown}
            onChange={(e) => changeDropdown(e)}
          >
            <option value={'people'}>People</option>
            <option value={'planets'}>Planets</option>
          </select>
          <label>
            <input
              type='checkbox'
              checked={checkbox3}
              onChange={() => updateCheckbox3(!checkbox3)}
            />
            _id
          </label>
          <div>
            {checkbox3 ? (
              // only show id dropdown if id box is checked
              <select name="select" value={id} onChange={(e) => changeId(e)}>
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
              type='checkbox'
              checked={checkbox1}
              onChange={() => updateCheckbox1(!checkbox1)}
            />
            {keys[0]}
          </label>
          <label>
            <input
              type='checkbox'
              checked={checkbox2}
              onChange={() => updateCheckbox2(!checkbox2)}
            />
            {keys[1]}
          </label>

          <label>
            <input
              type="checkbox"
              checked={checkbox4}
              onChange={() => updateCheckbox4(!checkbox4)}
            />
            {keys[2]}
          </label>
          <label>
            <input
              type="checkbox"
              checked={checkbox5}
              onChange={() => updateCheckbox5(!checkbox5)}
            />
            {keys[3]}
          </label>
          <div className="buttons">

            <button onClick={() => queryResult()}>Run Query</button>
            <button onClick={() => resetAll()}>Clear Cache</button>
          </div>
        </div>
        <div id='graphql-query-container'>
          <h3>GraphQL Query</h3>
          <div id='query'>
            <QueryCode
              checkbox1={checkbox1}
              checkbox2={checkbox2}
              checkbox4={checkbox4}
              checkbox5={checkbox5}
              keys={keys}
              currentDropdown={currentDropdown}
              id={checkbox3 ? id : undefined}
            />
          </div>
        </div>
        <div id='response-query-container'>
          <h3>Query Results</h3>
          <div id='query-results'>
            {/* check if user is editing fields, if so, this part is null */}
            {fetchData ? (
              <QueryResult
                checkbox1={checkbox1}
                checkbox2={checkbox2}
                checkbox4={checkbox4}
                checkbox5={checkbox5}
                keys={keys}
                currentDropdown={currentDropdown}
                data={data}
                id={checkbox3 ? resultId : undefined}
              />
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
