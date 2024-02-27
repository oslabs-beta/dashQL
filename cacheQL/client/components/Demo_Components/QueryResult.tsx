type Querystr = {
  data: any;
  keys:string[];
  currentDropdown: string;
  checkbox1?:boolean;
  checkbox2?: boolean;
  checkbox3?:boolean;
  checkbox4?:boolean;
  nestedBox: boolean;
  nestedBox2: boolean;
  id?: string | undefined
  dataField: string
}

export default function QueryResult({data, keys, currentDropdown, checkbox1, checkbox2, checkbox3, checkbox4, nestedBox, nestedBox2, id, dataField}: Querystr) {
  const res = JSON.parse(data.res)
  console.log('IN QUERY RESULT-----','data is', data)

  // define what which properties will be displayed (ex: name, mass). These are used for being able to create the query code format to display
  const firstBox:string | null = checkbox1 ? `${keys[0]}` : null;
  const secondBox: string | null = checkbox2 ? `${keys[1]}` : null;
  const thirdBox: string | null = checkbox3 ? `${keys[2]}` : null;
  const fourthBox: string | null = checkbox4 ? `${keys[3]}` : null;
  // if (checkbox4 && currentDropdown == 'people'){
  //   fourthBox = `${keys[3]}`
  // } else if (checkbox4 && currentDropdown != 'people'){
  //   fourthBox = `${keys[3]}`
  // } else {
  //   fourthBox = null
  // }
  const idBox: string = id ? `(_id:${id})` : "";
  const end: null | string = !firstBox && !secondBox && !thirdBox && !fourthBox ? null : `}`;

  // define values to be displayed for each property
  console.log('res data', res.data[dataField], currentDropdown)
  
  const firstValue = res.data[dataField][keys[0]];
  const secondValue: string = res.data[dataField][keys[1]];
  const thirdValue: string = res.data[dataField][keys[2]];
  const fourthValue: string = res.data[dataField][keys[3]];

  const checkboxes = [firstBox, secondBox, thirdBox, fourthBox]
  const values = [firstValue, secondValue, thirdValue, fourthValue]
  
  const boxes = []
  if (id){
    for (let i=0;i<4;i++){
      if (i===3 && currentDropdown == "people"){
        boxes.push(<div className="second-indent">{values[i] ? `${checkboxes[i]} {` : null}</div>)
      } else {
        boxes.push(<div className="second-indent">{values[i] ? `${checkboxes[i]}: ${values[i]},` : null}</div>)
      }
    }
  } else {
    for (let i=0;i<4;i++){
      if (values[i]){
        let jsonValues = values[i];
        if (typeof values[i] === 'string') jsonValues = JSON.parse(values[i]);
        boxes.push(<div className="second-indent">{`${checkboxes[i]}s:`}</div>)
        for (let j = 0; j<10;j++){
          boxes.push(<div className="second-indent">{jsonValues[j]}</div>)
        }
      }
    }
    
  }

  const nestedBoxes = []
  if (checkbox4) {
    nestedBox ? nestedBoxes.push(<div className="third-indent">{`name: ${res.data[dataField][keys[3]]['name']}`}</div>) : null;
    nestedBox2 ? nestedBoxes.push(<div className="third-indent">{`classification: ${res.data[dataField][keys[3]]['classification']}`}</div>) : null;
  }
  
  const nestedEnd:string = checkbox4 && currentDropdown === "people" ? "}": ""

  return (
    <div className="query-text">
      <div id="query-tag">{`query {`}</div>
      <div className="first-indent">{`${currentDropdown} ${idBox} {`}</div>
      {boxes}
      {nestedBoxes}
      <div className="second-indent">{nestedEnd}</div>
      <div className="first-indent">{end}</div>
      <div id="query-tag">{"}"}</div>
    </div>
  );
}