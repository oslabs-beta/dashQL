import { React, useState } from "react";
import "../App.css";
// const getData = async function (
//     queryString: string,
//     graphqlEndpoint: string
//   ) {

//     console.log('in fetch')

//     const dataObj = await axios({
//       url: graphqlEndpoint,
//       method: 'post',
//       data: {
//         query: queryString,
//       },
//     });

//     console.log(dataObj)
//   }

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
            
        </div>
        <div id="query">GraphQL Query</div>
        <div id="query-results">Query Results</div>
      </section>
    </div>
  );
}
