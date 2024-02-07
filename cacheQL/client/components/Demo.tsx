import { React, useState } from "react";
import "../App.css";




const getData = async function (
  ) {

    // console.log('in fetch')

    // const dataObj = await fetch({
    //   url: graphqlEndpoint,
    //   method: 'post',
    //   data: {
    //     query: queryString,
    //   },
    // });

    // console.log(dataObj)
  }

//   const queryString = `
//   //     query {
//   //       CallingCode {
//   //         name
//   //         countries {
//   //           name
//   //         }
//   //       }
//   //     }

//   // ` ;

export default function Demo() {
    const [queryString, setQuery] = useState(
      "query{people(_id:1){name, mass}}"
    );

    
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
            <button onClick={()=>getData()}></button>
        </div>
        <div id="query">GraphQL Query</div>
        <div id="query-results">Query Results</div>
      </section>
    </div>
  );
}
